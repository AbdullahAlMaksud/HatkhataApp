import type { BazaarItem } from '@/types';
import React, { FC, ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { toLocalizedDigits } from '@/utils/calculations';

interface CompletedSectionProps {
  items: BazaarItem[];
  count: number;
  title: string;
  clearAllText: string;
  onClearAll: () => void;
  renderItem: (item: BazaarItem) => ReactNode;
  language?: string;
}

const CompletedSection: FC<CompletedSectionProps> = ({
  items,
  count,
  title,
  clearAllText,
  onClearAll,
  renderItem,
  language = 'en',
}) => {
  if (items.length === 0) return null;

  return (
    <View style={styles.completedSection}>
      <View style={styles.completedHeader}>
        <Text style={styles.completedTitle}>
          {title} ({toLocalizedDigits(count, language)})
        </Text>
        <Pressable onPress={onClearAll}>
          <Text style={styles.clearAllText}>{clearAllText}</Text>
        </Pressable>
      </View>
      {items.map((item) => renderItem(item))}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  completedSection: {
    marginTop: 20,
  },
  completedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  completedTitle: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.bold,
  },
  clearAllText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.destructive,
  },
}));

export default CompletedSection;
