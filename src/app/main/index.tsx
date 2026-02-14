import { useRouter } from 'expo-router';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastAndroid, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  CreateListModal,
  EmptyState,
  FAB,
  FilterModal,
  HomeHeader,
  ListGrid,
  SearchBar,
  type SortMode,
} from '@/components';
import { useListStore, useSettingsStore, useTagStore } from '@/store';
import { WithTheme, withUniTheme } from '@/styles/hoc/with-unistyles';

const HomeScreen: FC<WithTheme> = ({ theme }) => {
  const { t } = useTranslation('home');
  const router = useRouter();

  const currencySymbol = useSettingsStore((s) => s.currencySymbol);
  const showTotalPrice = useSettingsStore((s) => s.showTotalPrice);
  const hapticFeedback = useSettingsStore((s) => s.hapticFeedback);
  const lists = useListStore((s) => s.lists);
  const addList = useListStore((s) => s.addList);
  const togglePin = useListStore((s) => s.togglePin);
  const tags = useTagStore((s) => s.tags);

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLists = useMemo(() => {
    // Start with all lists; pinned always first
    let pinned = lists.filter((l) => l.isPinned);
    let unpinned = lists.filter((l) => !l.isPinned);

    // Apply sort within each group
    const sortFn = (a: (typeof lists)[0], b: (typeof lists)[0]) => {
      switch (sortMode) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'category':
          const tagA = tags.find((t) => t.id === a.tagId)?.name || '';
          const tagB = tags.find((t) => t.id === b.tagId)?.name || '';
          return tagA.localeCompare(tagB);
        default:
          return a.order - b.order;
      }
    };

    pinned = pinned.sort(sortFn);
    unpinned = unpinned.sort(sortFn);

    let sorted = [...pinned, ...unpinned];

    // Filter by tag if selected
    if (selectedTagIds.length > 0) {
      sorted = sorted.filter((list) => list.tagId && selectedTagIds.includes(list.tagId));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      sorted = sorted.filter(
        (list) =>
          list.title.toLowerCase().includes(q) ||
          list.items.some((item) => item.name.toLowerCase().includes(q)) ||
          (list.notes && list.notes.toLowerCase().includes(q))
      );
    }

    return sorted;
  }, [lists, selectedTagIds, sortMode, searchQuery, tags]);

  const handleCreateList = useCallback(
    (data: {
      title: string;
      tagId?: string;
      isUrgent: boolean;
      items: Array<{ name: string; quantity: string; price: number }>;
    }) => {
      addList(data.title, data.tagId, data.isUrgent, data.items);
      setShowCreateModal(false);
    },
    [addList]
  );

  const handleTogglePin = useCallback(
    (listId: string, isPinned: boolean) => {
      togglePin(listId);
      const msg = isPinned ? t('unpinned') : t('pinned');
      try {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
      } catch {
        // iOS doesn't have ToastAndroid – silent
      }
    },
    [togglePin, t]
  );

  const handleSearchToggle = () => {
    setIsSearching(!isSearching);
    if (isSearching) setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <HomeHeader
        onSearchToggle={handleSearchToggle}
        onFilterPress={() => setShowFilterModal(true)}
        onTagsPress={() => router.push('/main/tags')}
        onSettingsPress={() => router.push('/main/settings')}
        isSearching={isSearching}
      />

      {isSearching && (
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      )}

      {filteredLists.length === 0 ? (
        <EmptyState
          icon="cart-outline"
          title={searchQuery ? 'কোনো ফলাফল নেই' : t('emptyTitle')}
          subtitle={searchQuery ? 'অন্য কিছু খুঁজে দেখুন' : t('emptySubtitle')}
        />
      ) : (
        <ListGrid
          lists={filteredLists}
          currencySymbol={currencySymbol}
          showTotalPrice={showTotalPrice}
          hapticEnabled={hapticFeedback}
          onTogglePin={handleTogglePin}
        />
      )}

      <FAB onPress={() => setShowCreateModal(true)} />

      <CreateListModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateList}
      />

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        tags={tags}
        selectedTagIds={selectedTagIds}
        onSelectTag={(id) => {
          setSelectedTagIds((prev) =>
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
          );
        }}
        sortMode={sortMode}
        setSortMode={setSortMode}
        onClear={() => {
          setSelectedTagIds([]);
          setSortMode('newest');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));

export default withUniTheme(HomeScreen);
