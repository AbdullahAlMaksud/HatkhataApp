import type { Tag } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export type SortMode = 'newest' | 'oldest' | 'category' | 'alphabetical';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  tags: Tag[];
  selectedTagIds: string[];
  onSelectTag: (id: string) => void;
  sortMode: SortMode;
  setSortMode: (mode: SortMode) => void;
  onClear: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  tags,
  selectedTagIds,
  onSelectTag,
  sortMode,
  setSortMode,
  onClear,
}) => {
  const { t } = useTranslation('home');
  const { t: tc } = useTranslation('common');

  // Sort tags alphabetically for display
  const sortedTags = [...tags].sort((a, b) => a.name.localeCompare(b.name));

  const SORT_OPTIONS: { key: SortMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'newest', label: t('sortNewest'), icon: 'arrow-down' },
    { key: 'oldest', label: t('sortOldest'), icon: 'arrow-up' },
    { key: 'alphabetical', label: t('sortAlphabetical' as any), icon: 'text' },
    { key: 'category', label: t('sortCategory'), icon: 'pricetag-outline' },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={24} color={styles.closeIcon.color} />
          </Pressable>
          <Text style={styles.headerTitle}>{t('filterAndSort' as any)}</Text>
          <Pressable onPress={onClear} hitSlop={8}>
            <Text style={styles.clearButton}>{t('clearAll' as any)}</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          {/* Sort Section */}
          <Text style={styles.sectionTitle}>{t('sortBy' as any)}</Text>
          <View style={styles.sortContainer}>
            {SORT_OPTIONS.map((opt) => (
              <Pressable
                key={opt.key}
                style={[
                  styles.sortOption,
                  sortMode === opt.key && styles.sortOptionActive,
                ]}
                onPress={() => setSortMode(opt.key)}
              >
                <Ionicons
                  name={opt.icon}
                  size={16}
                  color={sortMode === opt.key ? '#FFFFFF' : styles.sortIcon.color}
                />
                <Text
                  style={[
                    styles.sortLabel,
                    sortMode === opt.key && styles.sortLabelActive,
                  ]}
                >
                  {opt.label}
                </Text>
                {sortMode === opt.key && (
                  <View style={styles.checkmarkContainer}>
                     <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                )}
              </Pressable>
            ))}
          </View>

          {/* Categories Section */}
          <Text style={styles.sectionTitle}>{t('categories' as any)}</Text>
          <View style={styles.categoriesContainer}>
            {sortedTags.map((tag) => {
              const isSelected = selectedTagIds.includes(tag.id);
              return (
                <Pressable
                  key={tag.id}
                  style={[
                    styles.tagRow,
                    isSelected && styles.tagRowActive,
                  ]}
                  onPress={() => onSelectTag(tag.id)}
                >
                  <View style={styles.tagInfo}>
                    <View style={[styles.tagDot, { backgroundColor: tag.color }]} />
                    <Text style={[styles.tagLabel, isSelected && styles.tagLabelActive]}>
                      {tag.name}
                    </Text>
                  </View>
                  <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                    {isSelected && (
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: rt.insets.top,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  closeIcon: {
    color: theme.colors.text,
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.bold,
  },
  clearButton: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.medium,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.semiBold,
    marginBottom: 12,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Sort Styles
  sortContainer: {
    gap: 8,
    marginBottom: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    gap: 8,
  },
  sortOptionActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  sortIcon: {
    color: theme.colors.text,
  },
  sortLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.medium,
  },
  sortLabelActive: {
    color: '#FFFFFF',
  },
  checkmarkContainer: {
    marginLeft: 4,
  },
  // Category Styles
  categoriesContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  tagRowActive: {
    backgroundColor: theme.colors.primary + '10', // 10% opacity
  },
  tagInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tagDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  tagLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.medium,
  },
  tagLabelActive: {
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.semiBold,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
}));

export default FilterModal;
