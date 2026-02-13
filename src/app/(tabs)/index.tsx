import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { BazaarListCard } from '@/components/BazaarListCard';
import { CreateListModal } from '@/components/CreateListModal';
import { EmptyState } from '@/components/EmptyState';
import { FAB } from '@/components/FAB';
import { useListStore, useSettingsStore, useTagStore, useUserStore } from '@/store';

type SortMode = 'newest' | 'oldest' | 'category';

export default function HomeScreen() {
  const { t } = useTranslation('home');
  const { t: tc } = useTranslation('common');
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const userName = useUserStore((s) => s.profile.name);
  const currencySymbol = useSettingsStore((s) => s.currencySymbol);
  const showTotalPrice = useSettingsStore((s) => s.showTotalPrice);
  const hapticFeedback = useSettingsStore((s) => s.hapticFeedback);
  const lists = useListStore((s) => s.lists);
  const addList = useListStore((s) => s.addList);
  const togglePin = useListStore((s) => s.togglePin);
  const tags = useTagStore((s) => s.tags);

  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
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
        case 'category':
          return (a.tagId ?? '').localeCompare(b.tagId ?? '');
        default:
          return a.order - b.order;
      }
    };

    pinned = pinned.sort(sortFn);
    unpinned = unpinned.sort(sortFn);

    let sorted = [...pinned, ...unpinned];

    // Filter by tag if selected
    if (selectedTagId) {
      sorted = sorted.filter((list) => list.tagId === selectedTagId);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      sorted = sorted.filter(
        (list) =>
          list.title.toLowerCase().includes(q) ||
          list.items.some((item) => item.name.toLowerCase().includes(q)) ||
          (list.notes && list.notes.toLowerCase().includes(q)),
      );
    }

    return sorted;
  }, [lists, selectedTagId, sortMode, searchQuery]);

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
    [addList],
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
    [togglePin, t],
  );

  const renderListItem = useCallback(
    ({ item, index }: { item: (typeof filteredLists)[0]; index: number }) => (
      <View style={[styles.cardWrapper, index % 2 === 0 ? styles.cardLeft : styles.cardRight]}>
        <BazaarListCard
          list={item}
          currencySymbol={currencySymbol}
          showTotalPrice={showTotalPrice}
          hapticEnabled={hapticFeedback}
          onLongPress={() => handleTogglePin(item.id, item.isPinned)}
        />
      </View>
    ),
    [currencySymbol, handleTogglePin],
  );

  const SORT_OPTIONS: { key: SortMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'newest', label: t('sortNewest'), icon: 'arrow-down' },
    { key: 'oldest', label: t('sortOldest'), icon: 'arrow-up' },
    { key: 'category', label: t('sortCategory'), icon: 'pricetag-outline' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>{t('greeting')} ({tc('welcome').toUpperCase()})</Text>
          <Text style={styles.title}>{t('title')}</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            style={[styles.headerBtn, isSearching && styles.headerBtnActive]}
            onPress={() => {
              setIsSearching(!isSearching);
              if (isSearching) setSearchQuery('');
            }}
          >
            <Ionicons
              name={isSearching ? 'close' : 'search'}
              size={20}
              color={isSearching ? '#FFFFFF' : styles.headerBtnIcon.color}
            />
          </Pressable>
          <Pressable
            style={styles.headerBtn}
            onPress={() => router.push('/(tabs)/tags')}
          >
            <Ionicons name="pricetag-outline" size={20} color={styles.headerBtnIcon.color} />
          </Pressable>
          <Pressable
            style={styles.headerBtn}
            onPress={() => router.push('/(tabs)/settings')}
          >
            <Ionicons name="settings-outline" size={20} color={styles.headerBtnIcon.color} />
          </Pressable>
        </View>
      </View>

      {/* Search Bar */}
      {isSearching && (
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={styles.searchBarIcon.color} />
          <TextInput
            style={styles.searchInput}
            placeholder={'তালিকা খুঁজুন...'}
            placeholderTextColor={styles.searchBarIcon.color}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={styles.searchBarIcon.color} />
            </Pressable>
          )}
        </View>
      )}

      {/* Tag Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        <Pressable
          style={[
            styles.filterChip,
            !selectedTagId && styles.filterChipActive,
          ]}
          onPress={() => setSelectedTagId(null)}
        >
          <Text
            style={[
              styles.filterLabel,
              !selectedTagId && styles.filterLabelActive,
            ]}
          >
            {t('filterAll')}
          </Text>
        </Pressable>
        {tags.map((tag) => (
          <Pressable
            key={tag.id}
            style={[
              styles.filterChip,
              selectedTagId === tag.id && styles.filterChipActive,
            ]}
            onPress={() =>
              setSelectedTagId(selectedTagId === tag.id ? null : tag.id)
            }
          >
            <View style={[styles.filterDot, { backgroundColor: tag.color }]} />
            <Text
              style={[
                styles.filterLabel,
                selectedTagId === tag.id && styles.filterLabelActive,
              ]}
            >
              {tag.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Sort Options */}
      <View style={styles.sortRow}>
        {SORT_OPTIONS.map((opt) => (
          <Pressable
            key={opt.key}
            style={[
              styles.sortChip,
              sortMode === opt.key && styles.sortChipActive,
            ]}
            onPress={() => setSortMode(opt.key)}
          >
            <Ionicons
              name={opt.icon}
              size={12}
              color={sortMode === opt.key ? '#FFFFFF' : styles.sortChipText.color}
            />
            <Text
              style={[
                styles.sortChipText,
                sortMode === opt.key && styles.sortChipTextActive,
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Lists Grid */}
      {filteredLists.length === 0 ? (
        <EmptyState
          icon="cart-outline"
          title={searchQuery ? 'কোনো ফলাফল নেই' : t('emptyTitle')}
          subtitle={searchQuery ? 'অন্য কিছু খুঁজে দেখুন' : t('emptySubtitle')}
        />
      ) : (
        <FlatList
          data={filteredLists}
          renderItem={renderListItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
        />
      )}

      {/* FAB */}
      <FAB onPress={() => setShowCreateModal(true)} />

      {/* Create List Modal */}
      <CreateListModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateList}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  greeting: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.semiBold,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    fontSize: theme.fontSize['3xl'],
    color: theme.colors.text,
    fontFamily: theme.fontFamily.bold,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  headerBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  headerBtnIcon: {
    color: theme.colors.text,
  },
  // Search bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    gap: 10,
  },
  searchBarIcon: {
    color: theme.colors.textMuted,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.regular,
    padding: 0,
  },
  filterScroll: {
    maxHeight: 44,
    marginBottom: 4,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  filterLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.medium,
  },
  filterLabelActive: {
    color: '#FFFFFF',
  },
  // Sort row
  sortRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
    marginTop: 8,
  },
  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    gap: 4,
  },
  sortChipActive: {
    backgroundColor: theme.colors.primary,
  },
  sortChipText: {
    fontSize: theme.fontSize.xxs,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.medium,
  },
  sortChipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardWrapper: {
    flex: 1,
    maxWidth: '48.5%',
  },
  cardLeft: {
    marginRight: 4,
  },
  cardRight: {
    marginLeft: 4,
  },
}));
