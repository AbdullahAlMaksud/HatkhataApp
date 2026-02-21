import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type { Tag } from '@/types';

interface ListTitleSectionProps {
  title: string;
  date: string;
  isEditing?: boolean;
  onChangeTitle?: (text: string) => void;
  // Tag support
  tag?: Tag;
  tags?: Tag[];
  selectedTagId?: string;
  onChangeTag?: (tagId: string | undefined) => void;
  // Urgent support
  isUrgent?: boolean;
  onToggleUrgent?: (value: boolean) => void;
  urgentLabel?: string;
}

export const ListTitleSection: React.FC<ListTitleSectionProps> = ({
  title,
  date,
  isEditing = false,
  onChangeTitle,
  tag,
  tags = [],
  selectedTagId,
  onChangeTag,
  isUrgent = false,
  onToggleUrgent,
  urgentLabel = 'Urgent',
}) => {
  return (
    <View style={styles.container}>
      {/* Title */}
      {isEditing ? (
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={onChangeTitle}
          placeholder="List Title"
          multiline
        />
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}
      <Text style={styles.date}>{date}</Text>

      {/* View mode: show current tag & urgent badge inline */}
      {!isEditing && (tag || isUrgent) && (
        <View style={styles.metaRow}>
          {tag && (
            <View style={[styles.tagBadge, { borderColor: tag.color }]}>
              <View style={[styles.tagDot, { backgroundColor: tag.color }]} />
              <Text style={styles.tagBadgeLabel}>{tag.name}</Text>
            </View>
          )}
          {isUrgent && (
            <View style={styles.urgentBadge}>
              <Ionicons
                name="alert-circle"
                size={12}
                color={styles.urgentIcon.color}
              />
              <Text style={styles.urgentBadgeLabel}>{urgentLabel}</Text>
            </View>
          )}
        </View>
      )}

      {/* Edit mode: tag selector */}
      {isEditing && tags.length > 0 && (
        <View style={styles.editSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tagsScroll}
            contentContainerStyle={styles.tagsScrollContent}>
            {tags.map(t => (
              <Pressable
                key={t.id}
                style={[
                  styles.tagChip,
                  selectedTagId === t.id && styles.tagChipSelected,
                  selectedTagId === t.id && {
                    borderColor: t.color,
                    backgroundColor: t.color + '15',
                  },
                ]}
                onPress={() =>
                  onChangeTag?.(selectedTagId === t.id ? undefined : t.id)
                }>
                <View style={[styles.tagDot, { backgroundColor: t.color }]} />
                <Text
                  style={[
                    styles.tagChipLabel,
                    selectedTagId === t.id && styles.tagChipLabelSelected,
                  ]}>
                  {t.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Edit mode: urgent toggle */}
      {isEditing && (
        <View style={styles.urgentToggleRow}>
          <Ionicons
            name="alert-circle"
            size={18}
            color={styles.urgentIcon.color}
          />
          <Text style={styles.urgentToggleLabel}>{urgentLabel}</Text>
          <Switch
            value={isUrgent}
            onValueChange={onToggleUrgent}
            trackColor={{
              false: styles.switchTrack.backgroundColor,
              true: styles.switchActive.backgroundColor,
            }}
            thumbColor="#FFFFFF"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  titleInput: {
    fontSize: theme.fontSize.xl,
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    padding: 0,
  },
  date: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    fontFamily: theme.fontFamily.regular,
  },

  // View mode meta row
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
  },
  tagDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 5,
  },
  tagBadgeLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.medium,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: theme.colors.urgentLight,
    gap: 4,
  },
  urgentIcon: {
    color: theme.colors.urgent,
  },
  urgentBadgeLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.urgent,
    fontFamily: theme.fontFamily.semiBold,
  },

  // Edit mode: tag selector
  editSection: {
    marginTop: 12,
  },
  tagsScroll: {
    marginHorizontal: -20,
  },
  tagsScrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  tagChipSelected: {
    borderWidth: 1.5,
  },
  tagChipLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.regular,
  },
  tagChipLabelSelected: {
    fontFamily: theme.fontFamily.semiBold,
  },

  // Edit mode: urgent toggle
  urgentToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 6,
  },
  urgentToggleLabel: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.regular,
  },
  switchTrack: {
    backgroundColor: theme.colors.border,
  },
  switchActive: {
    backgroundColor: theme.colors.urgent,
  },
}));
