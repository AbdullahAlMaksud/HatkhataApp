import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { toLocalizedDigits } from '@/utils/calculations';

interface TotalFooterProps {
  total: string;
  itemCount: number;
  totalLabel: string;
  itemsLabel: string;
  paddingBottom: number;
  language?: string;
}

const TotalFooter: FC<TotalFooterProps> = ({
  total,
  itemCount,
  totalLabel,
  itemsLabel,
  paddingBottom,
  language = 'en',
}) => {
  return (
    <View style={[styles.footer, { paddingBottom }]}>
      <View>
        <Text style={styles.footerLabel}>{totalLabel}</Text>
        <Text style={styles.footerCount}>
          {toLocalizedDigits(itemCount, language)} {itemsLabel}
        </Text>
      </View>
      <Text style={styles.footerTotal}>{total}</Text>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    ...theme.shadows.md,
  },
  footerLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.semiBold,
  },
  footerCount: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  footerTotal: {
    fontSize: theme.fontSize['3xl'],
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.bold,
  },
}));

export default TotalFooter;
