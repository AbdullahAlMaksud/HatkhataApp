import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Ionicons } from '@expo/vector-icons';

import type { BazaarItem } from '@/types';

interface BazaarItemRowProps {
  item: BazaarItem;
  currencySymbol?: string;
  tagName?: string;
  onToggleCheck: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<Omit<BazaarItem, 'id'>>) => void;
  onDrag?: () => void;
  isDragging?: boolean;
}

export const BazaarItemRow: React.FC<BazaarItemRowProps> = ({
  item,
  currencySymbol = '৳',
  tagName,
  onToggleCheck,
  onDelete,
  onUpdate,
  onDrag,
  isDragging = false,
}) => {
  return (
    <View style={[styles.container, item.isChecked && styles.containerChecked, isDragging && styles.containerDragging]}>
      {/* Drag Handle */}
      {onDrag && !item.isChecked && (
        <Pressable onLongPress={onDrag} delayLongPress={100} hitSlop={4}>
          <Ionicons name="reorder-three-outline" size={20} color={styles.dragHandle.color} />
        </Pressable>
      )}

      {/* Checkbox */}
      <Pressable onPress={onToggleCheck} style={styles.checkbox} hitSlop={8}>
        {item.isChecked ? (
          <Ionicons name="checkmark-circle" size={24} color={styles.checkedIcon.color} />
        ) : (
          <View style={styles.uncheckedCircle} />
        )}
      </Pressable>

      {/* Item Info */}
      <View style={styles.info}>
        <Text
          style={[styles.name, item.isChecked && styles.nameChecked]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        {tagName && (
          <Text style={styles.tag} numberOfLines={1}>
            {tagName}
          </Text>
        )}
      </View>

      {/* Quantity */}
      {item.quantity ? (
        <View style={styles.qtyContainer}>
          <TextInput
            style={styles.qtyInput}
            value={item.quantity}
            onChangeText={(text) => {
              onUpdate({ quantity: text });
            }}
            selectTextOnFocus
          />
          {item.unit && <Text style={styles.unit}>{item.unit}</Text>}
        </View>
      ) : null}

      {/* Price — Editable */}
      <TextInput
        style={styles.priceInput}
        value={item.price > 0 ? String(item.price) : ''}
        placeholder={`${currencySymbol} 0`}
        placeholderTextColor={styles.pricePlaceholder.color}
        onChangeText={(text) => {
          const price = parseFloat(text) || 0;
          onUpdate({ price });
        }}
        keyboardType="numeric"
        selectTextOnFocus
      />

      {/* Delete */}
      <Pressable onPress={onDelete} hitSlop={8} style={styles.deleteBtn}>
        <Ionicons name="close-circle-outline" size={18} color={styles.deleteIcon.color} />
      </Pressable>
    </View>
  );
};

// Simplified row for adding new items inline
interface AddItemRowProps {
  placeholder: string;
  currencySymbol?: string;
  onSubmit: (name: string, quantity?: string, price?: number) => void;
}

export const AddItemRow: React.FC<AddItemRowProps> = ({
  placeholder,
  currencySymbol = '৳',
  onSubmit,
}) => {
  const [name, setName] = React.useState('');
  const [quantity, setQuantity] = React.useState('');
  const [price, setPrice] = React.useState('');

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (trimmed) {
      const parsedPrice = parseFloat(price) || 0;
      onSubmit(trimmed, quantity.trim() || undefined, parsedPrice || undefined);
      setName('');
      setQuantity('');
      setPrice('');
    }
  };

  return (
    <View style={styles.addContainer}>
      <View style={styles.checkbox}>
        <View style={styles.uncheckedCircleFaded} />
      </View>
      <TextInput
        style={styles.addInput}
        placeholder={placeholder}
        placeholderTextColor={styles.placeholder.color}
        value={name}
        onChangeText={setName}
        onSubmitEditing={handleSubmit}
        returnKeyType="next"
      />
      <TextInput
        style={styles.addQtyInput}
        placeholder="পরিমাণ"
        placeholderTextColor={styles.placeholder.color}
        value={quantity}
        onChangeText={setQuantity}
        onSubmitEditing={handleSubmit}
        returnKeyType="next"
      />
      <TextInput
        style={styles.addPriceInput}
        placeholder={`${currencySymbol} 0`}
        placeholderTextColor={styles.placeholder.color}
        value={price}
        onChangeText={setPrice}
        onSubmitEditing={handleSubmit}
        keyboardType="numeric"
        returnKeyType="done"
      />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    gap: 10,
  },
  containerChecked: {
    opacity: 0.7,
  },
  containerDragging: {
    opacity: 0.9,
    backgroundColor: '#F0FFF4',
    borderColor: '#38A169',
    ...({ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 6 }),
  },
  dragHandle: {
    color: theme.colors.textMuted,
  },
  checkbox: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedIcon: {
    color: theme.colors.primary,
  },
  uncheckedCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  uncheckedCircleFaded: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.colors.borderLight,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.semiBold,
  },
  nameChecked: {
    textDecorationLine: 'line-through',
    color: theme.colors.textMuted,
  },
  tag: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  qtyInput: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.regular,
    minWidth: 24,
    textAlign: 'center',
    padding: 0,
  },
  unit: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
  },
  priceInput: {
    fontSize: theme.fontSize.base,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.semiBold,
    minWidth: 60,
    textAlign: 'right',
    padding: 0,
  },
  pricePlaceholder: {
    color: theme.colors.textMuted,
  },
  deleteBtn: {
    padding: 2,
  },
  deleteIcon: {
    color: theme.colors.textMuted,
  },
  // Add Item Row
  addContainer: {
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
  placeholder: {
    color: theme.colors.textMuted,
  },
}));
