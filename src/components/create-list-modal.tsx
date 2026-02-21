/*
 * =============================================
 * OLD CreateListModal (commented out)
 * =============================================
 *
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
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
  const tags = useTagStore(s => s.tags);

  const [title, setTitle] = useState('');
  const [selectedTagId, setSelectedTagId] = useState<string | undefined>(undefined);
  const [isUrgent, setIsUrgent] = useState(false);
  const [items, setItems] = useState<ChecklistItem[]>([createEmptyItem()]);

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
    const validItems = items.filter(item => item.name.trim());
    onSubmit({ title: title.trim(), tagId: selectedTagId, isUrgent, items: validItems });
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setSelectedTagId(undefined);
    setIsUrgent(false);
    setItems([createEmptyItem()]);
  };

  const handleClose = () => { resetForm(); onClose(); };

  const updateItem = (index: number, updates: Partial<ChecklistItem>) => {
    setItems(prev => prev.map((item, i) => (i === index ? { ...item, ...updates } : item)));
  };

  const removeItem = (index: number) => {
    setItems(prev => {
      const next = prev.filter((_, i) => i !== index);
      return next.length === 0 ? [createEmptyItem()] : next;
    });
  };

  const addNewItem = () => { setItems(prev => [...prev, createEmptyItem()]); };

  return ( ... ); // Old JSX removed for brevity
};
*/

// =============================================
// NEW CreateListModal — matches [id].tsx detail screen layout
// =============================================

import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { StyleSheet } from 'react-native-unistyles';

import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { useSettingsStore, useTagStore } from '@/store';
import BazaarItemRow from './bazaar-item-row';
import CustomSwitch from './custom-switch';

interface ChecklistItem {
  id: string;
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
    items: { name: string; quantity: string; price: number }[];
  }) => void;
  initialData?: {
    title: string;
    tagId?: string;
    isUrgent: boolean;
    items?: { name: string; quantity: string; price: number }[];
  };
}

let _itemIdCounter = 0;
const createEmptyItem = (): ChecklistItem => ({
  id: `new-item-${Date.now()}-${_itemIdCounter++}`,
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
  const tags = useTagStore(s => s.tags);
  const currencySymbol = useSettingsStore(s => s.currencySymbol);
  const language = useSettingsStore(s => s.language);

  const [title, setTitle] = useState('');
  const [selectedTagId, setSelectedTagId] = useState<string | undefined>(
    undefined,
  );
  const [isUrgent, setIsUrgent] = useState(false);
  const [items, setItems] = useState<ChecklistItem[]>([createEmptyItem()]);

  // Inline add-item state
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const newNameRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setTitle(initialData.title || '');
        setSelectedTagId(initialData.tagId);
        setIsUrgent(initialData.isUrgent || false);
        setItems(
          initialData.items && initialData.items.length > 0
            ? initialData.items.map(it => ({ ...it, id: createEmptyItem().id }))
            : [createEmptyItem()],
        );
      } else {
        resetForm();
      }
    }
  }, [visible, initialData]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    const validItems = items.filter(item => item.name.trim());
    onSubmit({
      title: title.trim(),
      tagId: selectedTagId,
      isUrgent,
      items: validItems.map(({ name, quantity, price }) => ({
        name,
        quantity,
        price,
      })),
    });
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setSelectedTagId(undefined);
    setIsUrgent(false);
    setItems([createEmptyItem()]);
    setNewName('');
    setNewQty('');
    setNewPrice('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const updateItem = (id: string, updates: Partial<ChecklistItem>) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddInline = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const parsedPrice = parseFloat(newPrice) || 0;
    setItems(prev => [
      ...prev,
      {
        id: createEmptyItem().id,
        name: trimmed,
        quantity: newQty.trim(),
        price: parsedPrice,
      },
    ]);
    setNewName('');
    setNewQty('');
    setNewPrice('');
    newNameRef.current?.focus();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}>
      <View style={styles.container}>
        {/* ─── Header (matches ListHeader) ─── */}
        <View style={styles.header}>
          <Pressable onPress={handleClose} hitSlop={8}>
            <Ionicons name="close" size={24} color={styles.headerIcon.color} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {initialData ? t('editList') : t('createNew')}
            </Text>
          </View>
          <Pressable
            onPress={handleSubmit}
            disabled={!title.trim()}
            hitSlop={8}>
            <Text
              style={[
                styles.saveButton,
                !title.trim() && styles.saveButtonDisabled,
              ]}>
              {tc('save')}
            </Text>
          </Pressable>
        </View>

        {/* ─── Body (matches detail screen scroll) ─── */}
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* ─── Title Section (matches ListTitleSection edit mode) ─── */}
          <View style={styles.titleSection}>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder={t('listTitlePlaceholder')}
              placeholderTextColor={styles.placeholder.color}
              multiline
              autoFocus
            />

            {/* Tag selector */}
            {tags.length > 0 && (
              <View style={styles.tagSelectorSection}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.tagsScrollContent}>
                  {tags.map(tag => (
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
                      }>
                      <View
                        style={[styles.tagDot, { backgroundColor: tag.color }]}
                      />
                      <Text
                        style={[
                          styles.tagChipLabel,
                          selectedTagId === tag.id &&
                            styles.tagChipLabelSelected,
                        ]}>
                        {tag.name}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Urgent toggle */}
            <View style={styles.urgentToggleRow}>
              <Ionicons
                name="alert-circle"
                size={18}
                color={styles.urgentIcon.color}
              />
              <Text style={styles.urgentToggleLabel}>{t('urgent')}</Text>
              <CustomSwitch
                value={isUrgent}
                onValueChange={setIsUrgent}
                activeColor={styles.switchActive.backgroundColor}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* ─── Items list (matches BazaarItemRow from detail screen) ─── */}
          {items.map((item, index) => (
            <BazaarItemRow
              isHorizontalMargin={false}
              key={item.id}
              item={{
                ...item,
                isChecked: false,
                tagId: undefined,
                order: index,
              }}
              currencySymbol={currencySymbol}
              tagName={undefined}
              onToggleCheck={() => {}}
              onDelete={() => removeItem(item.id)}
              onUpdate={updates => updateItem(item.id, updates)}
              onDrag={() => {}}
              isDragging={false}
              isEditing={true}
              language={language}
            />
          ))}

          {/* ─── Add Item Row (matches AddItemRow dashed card) ─── */}
          <View style={styles.addItemRow}>
            <TextInput
              ref={newNameRef}
              style={styles.addInput}
              placeholder={t('addItem')}
              placeholderTextColor={styles.placeholder.color}
              value={newName}
              onChangeText={setNewName}
              onSubmitEditing={handleAddInline}
              returnKeyType="next"
            />
            <TextInput
              style={styles.addQtyInput}
              placeholder={t('quantity')}
              placeholderTextColor={styles.placeholder.color}
              value={newQty}
              onChangeText={setNewQty}
              onSubmitEditing={handleAddInline}
              returnKeyType="next"
            />
            <TextInput
              style={styles.addPriceInput}
              placeholder={`${currencySymbol} 0`}
              placeholderTextColor={styles.placeholder.color}
              value={newPrice}
              onChangeText={setNewPrice}
              onSubmitEditing={handleAddInline}
              keyboardType="numeric"
              returnKeyType="done"
            />
            <View style={styles.addCheckbox}>
              <View style={styles.uncheckedCircleFaded} />
            </View>
          </View>
        </KeyboardAwareScrollView>
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

  // ─── Header (matches ListHeader from detail screen) ───
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  headerIcon: {
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
  saveButton: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.semiBold,
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },

  // ─── Scroll ───
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },

  // ─── Title section (matches ListTitleSection) ───
  titleSection: {
    paddingHorizontal: 4,
    paddingVertical: 12,
    marginBottom: 8,
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
  placeholder: {
    color: theme.colors.textMuted,
  },

  // ─── Tag selector (matches ListTitleSection edit mode) ───
  tagSelectorSection: {
    marginTop: 12,
  },
  tagsScrollContent: {
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
  tagDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 5,
  },
  tagChipLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.regular,
  },
  tagChipLabelSelected: {
    fontFamily: theme.fontFamily.semiBold,
  },

  // ─── Urgent toggle (matches ListTitleSection edit mode) ───
  urgentToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 6,
  },
  urgentIcon: {
    color: theme.colors.urgent,
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

  // ─── Add Item Row (matches AddItemRow from bazaar-item-row) ───
  addItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    borderStyle: 'dashed',
    gap: 10,
    opacity: 0.6,
  },
  addInput: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.regular,
    padding: 0,
  },
  addQtyInput: {
    width: 60,
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.regular,
    textAlign: 'center',
    padding: 0,
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.borderLight,
    paddingLeft: 8,
  },
  addPriceInput: {
    minWidth: 60,
    fontSize: theme.fontSize.base,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.semiBold,
    textAlign: 'right',
    padding: 0,
  },
  addCheckbox: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uncheckedCircleFaded: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.colors.borderLight,
  },
}));

export default CreateListModal;
