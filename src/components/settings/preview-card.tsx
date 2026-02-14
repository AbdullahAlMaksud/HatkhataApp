import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { toLocalizedDigits } from '@/utils/calculations';

interface PreviewCardProps {
  currencySymbol: string;
  previewText: string;
  previewSubtext: string;
  previewTotal: string;
  language?: string;
}

const PreviewCard: FC<PreviewCardProps> = ({
  currencySymbol,
  previewText,
  previewSubtext,
  previewTotal,
  language = 'en',
}) => {
  return (
    <View style={styles.previewCard}>
      <Text style={styles.previewTitle}>{previewText}</Text>
      <Text style={styles.previewSubtext}>{previewSubtext}</Text>
      <View style={styles.previewPriceRow}>
        <Text style={styles.previewPriceLabel}>{previewTotal}</Text>
        <Text style={styles.previewPrice}>
          {currencySymbol} {toLocalizedDigits(350, language)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  previewCard: {
    backgroundColor: theme.colors.card,
    marginHorizontal: 16,
    borderRadius: theme.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  previewTitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.bold,
  },
  previewSubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    fontFamily: theme.fontFamily.regular,
    marginTop: 4,
  },
  previewPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  previewPriceLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.medium,
  },
  previewPrice: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.bold,
  },
}));

export default PreviewCard;
