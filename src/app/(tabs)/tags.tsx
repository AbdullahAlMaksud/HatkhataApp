import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { CreateTagModal } from '@/components/CreateTagModal';
import { EmptyState } from '@/components/EmptyState';
import { FAB } from '@/components/FAB';
import { useListStore, useTagStore } from '@/store';
import type { Tag } from '@/types';

export default function TagsScreen() {
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
    [lists],
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
      <View style={styles.tagRow}>
        <View style={[styles.colorDot, { backgroundColor: item.color }]} />
        <View style={styles.tagInfo}>
          <Text style={styles.tagName}>{item.name}</Text>
          {usageCount > 0 && (
            <Text style={styles.tagUsage}>{t('usedInLists', { count: usageCount })}</Text>
          )}
        </View>
        <Pressable
          style={styles.actionBtn}
          onPress={() => {
            setEditingTag(item);
            setError(null);
          }}
          hitSlop={8}
        >
          <Ionicons name="pencil" size={16} color={styles.actionIcon.color} />
        </Pressable>
        <Pressable
          style={styles.actionBtn}
          onPress={() => handleDelete(item)}
          hitSlop={8}
        >
          <Ionicons name="trash-outline" size={16} color={styles.deleteIcon.color} />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('title')}</Text>
      </View>

      {tags.length === 0 ? (
        <EmptyState
          icon="pricetag-outline"
          title={t('noTags')}
          subtitle={t('noTagsSubtitle')}
        />
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

      <FAB onPress={() => {
        setError(null);
        setShowModal(true);
      }} />

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
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: theme.fontSize['3xl'],
    color: theme.colors.text,
    fontFamily: theme.fontFamily.bold,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 8,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    gap: 12,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  tagInfo: {
    flex: 1,
  },
  tagName: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.medium,
  },
  tagUsage: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    fontFamily: theme.fontFamily.regular,
    marginTop: 2,
  },
  actionBtn: {
    padding: 8,
  },
  actionIcon: {
    color: theme.colors.textMuted,
  },
  deleteIcon: {
    color: theme.colors.destructive,
  },
  separator: {
    height: 8,
  },
}));
