import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

import {
  CreateTagModal,
  EmptyState,
  FAB,
  TagListItem,
  TagsHeader,
} from '@/components';
import { useListStore, useTagStore } from '@/store';
import type { Tag } from '@/types';

const TagsScreen = () => {
  const { t } = useTranslation('tags');
  const { t: tc } = useTranslation('common');
  const insets = useSafeAreaInsets();

  const tags = useTagStore((s) => s.tags);
  const addTag = useTagStore((s) => s.addTag);
  const updateTag = useTagStore((s) => s.updateTag);
  const deleteTag = useTagStore((s) => s.deleteTag);
  const lists = useListStore((s) => s.lists);

  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getTagUsageCount = useCallback(
    (tagId: string) => lists.filter((l) => l.tagId === tagId).length,
    [lists]
  );

  const handleCreate = (name: string, color: string) => {
    const id = addTag(name, color);
    if (!id) {
      setError(tc('duplicate'));
      return;
    }
    setError(null);
    setShowModal(false);
  };

  const handleEdit = (name: string, color: string) => {
    if (!editingTag) return;
    const success = updateTag(editingTag.id, { name, color });
    if (!success) {
      setError(tc('duplicate'));
      return;
    }
    setError(null);
    setEditingTag(null);
  };

  const handleDelete = (tag: Tag) => {
    Alert.alert(t('deleteTag'), t('deleteTagConfirm'), [
      { text: tc('cancel'), style: 'cancel' },
      {
        text: tc('delete'),
        style: 'destructive',
        onPress: () => deleteTag(tag.id),
      },
    ]);
  };

  const renderTag = ({ item }: { item: Tag }) => {
    const usageCount = getTagUsageCount(item.id);
    return (
      <TagListItem
        tag={item}
        usageCount={usageCount}
        usageText={usageCount > 0 ? t('usedInLists', { count: usageCount }) : undefined}
        onEdit={() => {
          setEditingTag(item);
          setError(null);
        }}
        onDelete={() => handleDelete(item)}
      />
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TagsHeader title={t('title')} />

      {tags.length === 0 ? (
        <EmptyState icon="pricetag-outline" title={t('noTags')} subtitle={t('noTagsSubtitle')} />
      ) : (
        <FlatList
          data={tags}
          renderItem={renderTag}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      <FAB
        onPress={() => {
          setError(null);
          setShowModal(true);
        }}
      />

      <CreateTagModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreate}
        error={error}
      />

      <CreateTagModal
        visible={!!editingTag}
        onClose={() => setEditingTag(null)}
        onSubmit={handleEdit}
        initialData={editingTag ? { name: editingTag.name, color: editingTag.color } : undefined}
        error={error}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 8,
  },
  separator: {
    height: 8,
  },
}));

export default TagsScreen;
