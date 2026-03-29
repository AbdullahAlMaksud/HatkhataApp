import type { Tag } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface TagListItemProps {
  tag: Tag;
  usageCount: number;
  usageText?: string;
  onEdit: () => void;
  onDelete: () => void;
}

const TagListItem: FC<TagListItemProps> = ({
  tag,
  usageCount,
  usageText,
  onEdit,
  onDelete,
}) => {
  return (
    <View style={styles.tagRow}>
      <View style={[styles.colorDot, { backgroundColor: tag.color }]} />
      <View style={styles.tagInfo}>
        <Text style={styles.tagName}>{tag.name}</Text>
        {usageCount > 0 && usageText && <Text style={styles.tagUsage}>{usageText}</Text>}
      </View>
      <Pressable style={styles.actionBtn} onPress={onEdit} hitSlop={8}>
        <Ionicons name="pencil" size={16} color={styles.actionIcon.color} />
      </Pressable>
      <Pressable style={styles.actionBtn} onPress={onDelete} hitSlop={8}>
        <Ionicons name="trash-outline" size={16} color={styles.deleteIcon.color} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
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
}));

export default TagListItem;
