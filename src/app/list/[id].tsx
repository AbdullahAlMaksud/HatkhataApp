import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Text, View } from 'react-native';
import DraggableFlatList, {
  type RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

import {
  AddItemRow,
  BazaarItemRow,
  CompletedSection,
  FAB,
  ListHeader,
  ListTitleSection,
  TotalFooter,
} from '@/components';
import { useListStore, useSettingsStore, useTagStore } from '@/store';
import type { BazaarItem } from '@/types';
import { calculateListTotal, formatCurrency, sortItemsByOrder } from '@/utils/calculations';

const ListDetailScreen = () => {
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
  const language = useSettingsStore((s) => s.language);

  // Replaced showEditModal with isEditing
  const [isEditing, setIsEditing] = useState(false);

  if (!list) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.notFound}>List not found</Text>
      </View>
    );
  }

  const sortedItems = useMemo(
    () => sortItemsByOrder(list.items, moveCompletedToBottom),
    [list.items, moveCompletedToBottom]
  );
  const uncheckedItems = sortedItems.filter((i) => !i.isChecked);
  const checkedItems = sortedItems.filter((i) => i.isChecked);
  const total = useMemo(() => calculateListTotal(list.items), [list.items]);
  const createdDate = new Date(list.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
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

  const handleDeleteItem = (itemId: string) => {
    Alert.alert(tc('delete'), t('deleteItemConfirm'), [
      { text: tc('cancel'), style: 'cancel' },
      {
        text: tc('delete'),
        style: 'destructive',
        onPress: () => deleteItem(id, itemId),
      },
    ]);
  };

  const handleDragEnd = useCallback(
    ({ data }: { data: BazaarItem[] }) => {
      if (hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      reorderItems(id, data);
    },
    [id, reorderItems, hapticFeedback]
  );

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<BazaarItem>) => {
      const tag = item.tagId ? getTagById(item.tagId) : undefined;
      return (
        <ScaleDecorator activeScale={1.02}>
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
            onDelete={() => handleDeleteItem(item.id)}
            onUpdate={(updates) => updateItem(id, item.id, updates)}
            onDrag={() => {
              if (hapticFeedback) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
              drag();
            }}
            isDragging={isActive}
            isEditing={isEditing}
            language={language}
          />
        </ScaleDecorator>
      );
    },
    [currencySymbol, hapticFeedback, toggleItemCheck, deleteItem, updateItem, getTagById, id, isEditing]
  );

  const listData = moveCompletedToBottom ? uncheckedItems : sortedItems;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ListHeader
        title={t('title')}
        onBack={() => router.back()}
        onDelete={handleDeleteList}
      />

      <View style={{ flex: 1 }}>
        <DraggableFlatList
          data={listData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onDragEnd={handleDragEnd}
          showsVerticalScrollIndicator={false}
          activationDistance={10}
          ListHeaderComponent={
            <ListTitleSection
              title={list.title}
              date={createdDate}
              isEditing={isEditing}
              onChangeTitle={(text) => updateList(id, { title: text })}
            />
          }
          renderScrollComponent={(props) => (
            <KeyboardAwareScrollView 
              {...props} 
              contentContainerStyle={styles.listContent}
            />
          )}
          ListFooterComponent={
            <>
              <AddItemRow
                placeholder={t('addItem')}
                currencySymbol={currencySymbol}
                onSubmit={(name, quantity, price) => {
                  handleAddItem(name, quantity, price);
                }}
              />

              {moveCompletedToBottom && (
                <CompletedSection
                  items={checkedItems}
                  count={checkedItems.length}
                  title={t('completedSection')}
                  clearAllText={tc('clearAll')}
                  onClearAll={() => clearCheckedItems(id)}
                  language={language}
                  renderItem={(item) => {
                    const tag = item.tagId ? getTagById(item.tagId) : undefined;
                    return (
                      <BazaarItemRow
                        key={item.id}
                        item={item}
                        currencySymbol={currencySymbol}
                        tagName={tag?.name}
                        onToggleCheck={() => toggleItemCheck(id, item.id)}
                        onDelete={() => handleDeleteItem(item.id)}
                        onUpdate={(updates) => updateItem(id, item.id, updates)}
                        isEditing={isEditing}
                        language={language}
                      />
                    );
                  }}
                />
              )}
            </>
          }
        />
      </View>

      {showTotalPrice && (
        <TotalFooter
          total={formatCurrency(total, currencySymbol, language)}
          itemCount={list.items.length}
          totalLabel={t('totalCost')}
          itemsLabel={tc('items')}
          paddingBottom={insets.bottom + 16}
          language={language}
        />
      )}

      <FAB
        onPress={() => setIsEditing(!isEditing)}
        icon={isEditing ? 'checkmark-outline' : 'create-outline'}
        style={{ bottom: showTotalPrice ? insets.bottom + 100 : insets.bottom + 14 }}
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
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
}));

export default ListDetailScreen;
