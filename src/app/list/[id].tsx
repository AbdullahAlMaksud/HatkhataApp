import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  Text,
  View,
} from 'react-native';
import DraggableFlatList, {
  type RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { AddItemRow, BazaarItemRow } from '@/components/BazaarItemRow';
import { CreateListModal } from '@/components/CreateListModal';
import { FAB } from '@/components/FAB';
import { useListStore, useSettingsStore, useTagStore } from '@/store';
import type { BazaarItem } from '@/types';
import { calculateListTotal, formatCurrency, sortItemsByOrder } from '@/utils/calculations';

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation('list');
  const { t: tc } = useTranslation('common');
  const insets = useSafeAreaInsets();

  const list = useListStore((s) => s.getListById(id));
  const addItem = useListStore((s) => s.addItem);
  const updateItem = useListStore((s) => s.updateItem);
  const deleteItem = useListStore((s) => s.deleteItem);
  const toggleItemCheck = useListStore((s) => s.toggleItemCheck);
  const clearCheckedItems = useListStore((s) => s.clearCheckedItems);
  const deleteList = useListStore((s) => s.deleteList);
  const updateList = useListStore((s) => s.updateList);
  const reorderItems = useListStore((s) => s.reorderItems);
  const getTagById = useTagStore((s) => s.getTagById);
  const currencySymbol = useSettingsStore((s) => s.currencySymbol);
  const moveCompletedToBottom = useSettingsStore((s) => s.moveCompletedToBottom);
  const showTotalPrice = useSettingsStore((s) => s.showTotalPrice);
  const hapticFeedback = useSettingsStore((s) => s.hapticFeedback);

  const [showEditModal, setShowEditModal] = useState(false);

  if (!list) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.notFound}>List not found</Text>
      </View>
    );
  }

  const sortedItems = useMemo(
    () => sortItemsByOrder(list.items, moveCompletedToBottom),
    [list.items, moveCompletedToBottom],
  );
  const uncheckedItems = sortedItems.filter((i) => !i.isChecked);
  const checkedItems = sortedItems.filter((i) => i.isChecked);
  const total = useMemo(() => calculateListTotal(list.items), [list.items]);
  const createdDate = new Date(list.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleAddItem = (name: string, quantity?: string, price?: number) => {
    addItem(id, name, undefined, quantity, undefined, price);
  };

  const handleDeleteList = () => {
    Alert.alert(t('deleteList'), t('deleteListConfirm'), [
      { text: tc('cancel'), style: 'cancel' },
      {
        text: tc('delete'),
        style: 'destructive',
        onPress: () => {
          deleteList(id);
          router.back();
        },
      },
    ]);
  };

  const handleEditSubmit = (data: {
    title: string;
    tagId?: string;
    isUrgent: boolean;
    items: Array<{ name: string; quantity: string; price: number }>;
  }) => {
    updateList(id, {
      title: data.title,
      tagId: data.tagId,
      isUrgent: data.isUrgent,
      items: [
        ...list.items.filter((item) => item.isChecked),
        ...data.items.map((item, index) => ({
          id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}-${index}`,
          name: item.name,
          quantity: item.quantity || '',
          price: item.price || 0,
          isChecked: false,
          order: list.items.filter((i) => i.isChecked).length + index,
        })),
      ],
    });
    setShowEditModal(false);
  };

  const handleDragEnd = useCallback(
    ({ data }: { data: BazaarItem[] }) => {
      if (hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      reorderItems(id, data);
    },
    [id, reorderItems, hapticFeedback],
  );

  const editInitialData = {
    title: list.title,
    tagId: list.tagId,
    isUrgent: list.isUrgent,
    items: list.items
      .filter((item) => !item.isChecked)
      .map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
  };

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<BazaarItem>) => {
      const tag = item.tagId ? getTagById(item.tagId) : undefined;
      return (
        <ScaleDecorator>
          <BazaarItemRow
            item={item}
            currencySymbol={currencySymbol}
            tagName={tag?.name}
            onToggleCheck={() => {
              if (hapticFeedback) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              toggleItemCheck(id, item.id);
            }}
            onDelete={() => deleteItem(id, item.id)}
            onUpdate={(updates) => updateItem(id, item.id, updates)}
            onDrag={() => {
              if (hapticFeedback) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
              drag();
            }}
            isDragging={isActive}
          />
        </ScaleDecorator>
      );
    },
    [currencySymbol, hapticFeedback, toggleItemCheck, deleteItem, updateItem, getTagById, id],
  );

  const listData = moveCompletedToBottom ? uncheckedItems : sortedItems;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={styles.backIcon.color} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {list.title}
          </Text>
          <Text style={styles.headerDate}>{createdDate}</Text>
        </View>
        <Pressable onPress={handleDeleteList} hitSlop={8}>
          <Ionicons name="trash-outline" size={22} color={styles.deleteIcon.color} />
        </Pressable>
      </View>

<View style={{ flex: 1 }}>

      {/* Items — Draggable */}
      <DraggableFlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onDragEnd={handleDragEnd}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        activationDistance={10}
        ListFooterComponent={
          <>
            {/* Inline Add Item Row — Always visible */}
            <AddItemRow
              placeholder={t('addItem')}
              currencySymbol={currencySymbol}
              onSubmit={(name, quantity, price) => {
                handleAddItem(name, quantity, price);
              }}
            />

            {/* Completed section */}
            {moveCompletedToBottom && checkedItems.length > 0 && (
              <View style={styles.completedSection}>
                <View style={styles.completedHeader}>
                  <Text style={styles.completedTitle}>
                    {t('completedSection')} ({checkedItems.length})
                  </Text>
                  <Pressable onPress={() => clearCheckedItems(id)}>
                    <Text style={styles.clearAllText}>{tc('clearAll')}</Text>
                  </Pressable>
                </View>
                {checkedItems.map((item) => {
                  const tag = item.tagId ? getTagById(item.tagId) : undefined;
                  return (
                    <BazaarItemRow
                      key={item.id}
                      item={item}
                      currencySymbol={currencySymbol}
                      tagName={tag?.name}
                      onToggleCheck={() => toggleItemCheck(id, item.id)}
                      onDelete={() => deleteItem(id, item.id)}
                      onUpdate={(updates) => updateItem(id, item.id, updates)}
                    />
                  );
                })}
              </View>
            )}
          </>
        }
      />
</View>

      {/* Total Footer */}
      {showTotalPrice && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <View>
            <Text style={styles.footerLabel}>{t('totalCost')}</Text>
            <Text style={styles.footerCount}>
              {list.items.length} {tc('items')}
            </Text>
          </View>
          <Text style={styles.footerTotal}>
            {formatCurrency(total, currencySymbol)}
          </Text>
        </View>
      )}

      {/* FAB — Edit List */}
      <FAB
        onPress={() => setShowEditModal(true)}
        icon="create-outline"
        style={{ bottom: showTotalPrice ? 130 : insets.bottom + 64 }}
      />

      {/* Edit Modal */}
      <CreateListModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditSubmit}
        initialData={editInitialData}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  notFound: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backIcon: {
    color: theme.colors.text,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.bold,
  },
  headerDate: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  editIcon: {
    color: theme.colors.primary,
  },
  deleteIcon: {
    color: theme.colors.destructive,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
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
