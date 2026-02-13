import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Ionicons } from '@expo/vector-icons';

import { useTagStore } from '@/store';
import type { BazaarList } from '@/types';
import { calculateListTotal, formatCurrency } from '@/utils/calculations';
import { UrgentBadge } from './UrgentBadge';

interface BazaarListCardProps {
  list: BazaarList;
  currencySymbol?: string;
  showTotalPrice?: boolean;
  hapticEnabled?: boolean;
  onLongPress?: () => void;
}

const MAX_PREVIEW_ITEMS = 3;

export const BazaarListCard: React.FC<BazaarListCardProps> = ({
  list,
  currencySymbol = '৳',
  showTotalPrice = true,
  hapticEnabled = false,
  onLongPress,
}) => {
  const router = useRouter();
  const getTagById = useTagStore((s) => s.getTagById);

  const total = useMemo(() => calculateListTotal(list.items), [list.items]);
  const previewItems = list.items.slice(0, MAX_PREVIEW_ITEMS);
  const remainingCount = Math.max(0, list.items.length - MAX_PREVIEW_ITEMS);

  const handlePress = () => {
    router.push(`/list/${list.id}`);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={handlePress}
      onLongPress={() => {
        if (hapticEnabled) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        onLongPress?.();
      }}
      delayLongPress={400}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {list.title}
        </Text>
        {list.isUrgent && (
          <UrgentBadge label="Urgent" variant="urgent" />
        )}
        {list.isPinned && (
          <Ionicons name="pin" size={14} color={styles.pinIcon.color} />
        )}
      </View>

      {/* Items Preview */}
      <View style={styles.itemsPreview}>
        {previewItems.map((item) => {
          const tag = item.tagId ? getTagById(item.tagId) : undefined;
          return (
            <View key={item.id} style={styles.previewItem}>
              <View style={styles.previewCheckbox}>
                {item.isChecked ? (
                  <Ionicons name="checkmark-circle" size={18} color={styles.checkedIcon.color} />
                ) : (
                  <View style={styles.uncheckedCircle} />
                )}
              </View>
              <Text
                style={[styles.previewName, item.isChecked && styles.previewNameChecked]}
                numberOfLines={1}
              >
                {item.name}
                {tag ? ` (${tag.name})` : ''}
              </Text>
              {showTotalPrice && (
                <Text style={styles.previewPrice}>
                  {formatCurrency(item.price ?? 0, currencySymbol)}
                </Text>
              )}
            </View>
          );
        })}
        {remainingCount > 0 && (
          <Text style={styles.moreText}>+ {remainingCount} more</Text>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.itemCount}>
          {list.items.length} items
        </Text>
        {showTotalPrice ? (
          <Text style={styles.totalPrice}>
            {formatCurrency(total, currencySymbol)}
          </Text>
        ) : (
          <Text style={styles.lastEdited}>
            {new Date(list.updatedAt).toLocaleDateString('bn-BD', {
              day: 'numeric',
              month: 'short',
            })}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.sm,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  title: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.bold,
    flex: 1,
  },
  pinIcon: {
    color: theme.colors.textMuted,
  },
  itemsPreview: {
    gap: 6,
    marginBottom: 12,
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewCheckbox: {
    width: 18,
    height: 18,
  },
  checkedIcon: {
    color: theme.colors.primary,
  },
  uncheckedCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  previewName: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.regular,
  },
  previewNameChecked: {
    textDecorationLine: 'line-through',
    color: theme.colors.textMuted,
  },
  previewPrice: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.medium,
  },
  moreText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginLeft: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    paddingTop: 10,
  },
  itemCount: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
  },
  totalPrice: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.bold,
  },
  lastEdited: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    fontFamily: theme.fontFamily.regular,
  },
}));
