import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { useTagStore } from '@/store';

interface ChecklistItem {
  name: string;
  quantity: string;
  price: number;
}

interface CreateListModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    tagId?: string;
    isUrgent: boolean;
    items: ChecklistItem[];
  }) => void;
  // For editing
  initialData?: {
    title: string;
    tagId?: string;
    isUrgent: boolean;
    items?: ChecklistItem[];
  };
}

const createEmptyItem = (): ChecklistItem => ({
  name: '',
  quantity: '',
  price: 0,
});

const CreateListModal: React.FC<CreateListModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
}) => {
  const { t } = useTranslation('list');
  const { t: tc } = useTranslation('common');
  const tags = useTagStore((s) => s.tags);

  const [title, setTitle] = useState('');
  const [selectedTagId, setSelectedTagId] = useState<string | undefined>(undefined);
  const [isUrgent, setIsUrgent] = useState(false);
  const [items, setItems] = useState<ChecklistItem[]>([createEmptyItem()]);

  // Sync state when initialData changes (for edit mode)
  useEffect(() => {
    if (visible) {
      if (initialData) {
        setTitle(initialData.title || '');
        setSelectedTagId(initialData.tagId);
        setIsUrgent(initialData.isUrgent || false);
        setItems(
          initialData.items && initialData.items.length > 0
            ? initialData.items
            : [createEmptyItem()],
        );
      } else {
        resetForm();
      }
    }
  }, [visible, initialData]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    // Filter out items with empty names
    const validItems = items.filter((item) => item.name.trim());
    onSubmit({
      title: title.trim(),
      tagId: selectedTagId,
      isUrgent,
      items: validItems,
    });
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setSelectedTagId(undefined);
    setIsUrgent(false);
    setItems([createEmptyItem()]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const updateItem = (index: number, updates: Partial<ChecklistItem>) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updates } : item)),
    );
  };

  const removeItem = (index: number) => {
    setItems((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length === 0 ? [createEmptyItem()] : next;
    });
  };

  const addNewItem = () => {
    setItems((prev) => [...prev, createEmptyItem()]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleClose} hitSlop={8}>
            <Ionicons name="close" size={24} color={styles.closeIcon.color} />
          </Pressable>
          <Text style={styles.headerTitle}>
            {initialData ? t('editList') : t('createNew')}
          </Text>
          <Pressable
            onPress={handleSubmit}
            disabled={!title.trim()}
            hitSlop={8}
          >
            <Text
              style={[
                styles.saveButton,
                !title.trim() && styles.saveButtonDisabled,
              ]}
            >
              {tc('save')}
            </Text>
          </Pressable>
        </View>

        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          {/* Title */}
          <Text style={styles.fieldLabel}>{t('listTitle')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('listTitlePlaceholder')}
            placeholderTextColor={styles.inputPlaceholder.color}
            value={title}
            onChangeText={setTitle}
            autoFocus
          />

          {/* Tag Selection */}
          <Text style={styles.fieldLabel}>{t('selectTag')}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tagsScroll}
          >
            {tags.map((tag) => (
              <Pressable
                key={tag.id}
                style={[
                  styles.tagChip,
                  selectedTagId === tag.id && styles.tagChipSelected,
                  selectedTagId === tag.id && {
                    borderColor: tag.color,
                    backgroundColor: tag.color + '15',
                  },
                ]}
                onPress={() =>
                  setSelectedTagId(
                    selectedTagId === tag.id ? undefined : tag.id,
                  )
                }
              >
                <View
                  style={[styles.tagDot, { backgroundColor: tag.color }]}
                />
                <Text style={styles.tagLabel}>{tag.name}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Urgent Toggle */}
          <View style={styles.toggleRow}>
            <Ionicons name="alert-circle" size={20} color={styles.urgentIcon.color} />
            <Text style={styles.toggleLabel}>{t('urgent')}</Text>
            <Switch
              value={isUrgent}
              onValueChange={setIsUrgent}
              trackColor={{
                false: styles.switchTrack.backgroundColor,
                true: styles.switchActive.backgroundColor,
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Checklist Items */}
          <Text style={styles.fieldLabel}>{t('checklistItems')}</Text>
          {items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              {/* Item Name */}
              <TextInput
                style={styles.itemNameInput}
                placeholder={t('itemNamePlaceholder')}
                placeholderTextColor={styles.inputPlaceholder.color}
                value={item.name}
                onChangeText={(text) => updateItem(index, { name: text })}
              />
              <View style={styles.itemSubRow}>
                {/* Quantity */}
                <View style={styles.itemFieldGroup}>
                  <Text style={styles.itemFieldLabel}>{t('quantity')}</Text>
                  <TextInput
                    style={styles.itemSmallInput}
                    placeholder="—"
                    placeholderTextColor={styles.inputPlaceholder.color}
                    value={item.quantity}
                    onChangeText={(text) =>
                      updateItem(index, { quantity: text })
                    }
                  />
                </View>
                {/* Price */}
                <View style={styles.itemFieldGroup}>
                  <Text style={styles.itemFieldLabel}>{t('price')}</Text>
                  <TextInput
                    style={styles.itemSmallInput}
                    placeholder="0"
                    placeholderTextColor={styles.inputPlaceholder.color}
                    value={item.price > 0 ? String(item.price) : ''}
                    onChangeText={(text) =>
                      updateItem(index, { price: parseFloat(text) || 0 })
                    }
                    keyboardType="numeric"
                  />
                </View>
                {/* Remove */}
                <Pressable
                  onPress={() => removeItem(index)}
                  hitSlop={8}
                  style={styles.removeBtn}
                >
                  <Ionicons
                    name="close-circle"
                    size={22}
                    color={styles.removeIcon.color}
                  />
                </Pressable>
              </View>
            </View>
          ))}

          {/* Add Item Button */}
          <Pressable onPress={addNewItem} style={styles.addItemBtn}>
            <Ionicons
              name="add-circle-outline"
              size={20}
              color={styles.addItemIcon.color}
            />
            <Text style={styles.addItemText}>{t('addAnotherItem')}</Text>
          </Pressable>
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
  saveButton: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  fieldLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.semiBold,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.regular,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  inputPlaceholder: {
    color: theme.colors.textMuted,
  },
  tagsScroll: {
    marginBottom: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 8,
    backgroundColor: theme.colors.card,
  },
  tagChipSelected: {
    borderWidth: 1.5,
  },
  tagDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  tagLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 10,
    marginTop: 16,
  },
  urgentIcon: {
    color: theme.colors.urgent,
  },
  toggleLabel: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.regular,
  },
  switchTrack: {
    backgroundColor: theme.colors.border,
  },
  switchActive: {
    backgroundColor: theme.colors.urgent,
  },
  // Checklist items
  itemRow: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    padding: 12,
    marginBottom: 10,
  },
  itemNameInput: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.regular,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    marginBottom: 8,
  },
  itemSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemFieldGroup: {
    flex: 1,
  },
  itemFieldLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  itemSmallInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.regular,
  },
  removeBtn: {
    paddingTop: 14,
  },
  removeIcon: {
    color: theme.colors.destructive,
  },
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
    marginTop: 4,
    marginBottom: 40,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.lg,
  },
  addItemIcon: {
    color: theme.colors.primary,
  },
  addItemText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.semiBold,
  },
}));

export default CreateListModal;
