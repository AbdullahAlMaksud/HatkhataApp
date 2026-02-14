import React, { FC } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { StyleSheet } from 'react-native-unistyles';

import { Ionicons } from '@expo/vector-icons';

import type { BazaarItem } from '@/types';

import { WithTheme, withUniTheme } from '@/styles/hoc/with-unistyles';
import { formatCurrency, toLocalizedDigits } from '@/utils/calculations';

interface BazaarItemRowProps extends WithTheme {
  item: BazaarItem;
  currencySymbol?: string;
  tagName?: string;
  onToggleCheck: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<Omit<BazaarItem, 'id'>>) => void;
  onDrag?: () => void;
  isDragging?: boolean;
  isEditing?: boolean;
  language?: string;
}

const BazaarItemRow: React.FC<BazaarItemRowProps> = ({
  item,
  currencySymbol = '৳',
  tagName,
  onToggleCheck,
  onDelete,
  onUpdate,
  onDrag,
  isDragging = false,
  isEditing = false,
  language = 'en',
  theme
}) => {
  // ... (swipe actions remain same)

  return (
    <ReanimatedSwipeable
      // ... (props remain same)
    >
      <Pressable
        onLongPress={onDrag}
        delayLongPress={200}
        
        style={({ pressed }) => [
          styles.container,
          item.isChecked && styles.containerChecked,
          (isDragging || pressed) && styles.containerDragging
        ]}
      >

         {/* Checkbox or Delete Button */}
        <Pressable 
          onPress={isEditing ? onDelete : onToggleCheck} 
          style={styles.checkbox} 
          hitSlop={8} 
          disabled={false}
        >
            {item.isChecked ? (
              <Ionicons name="checkmark-circle" size={24} color={styles.checkedIcon.color} />
            ) : (
              <View style={styles.uncheckedCircle} />
            )}
        </Pressable>
        {/* <Pressable onPressIn={onDrag} hitSlop={10} style={{ paddingRight: 8 }}>
          <Ionicons name="reorder-two" size={24} color={styles.dragHandle.color} />
        </Pressable> */}

        <View style={styles.info}>
          {isEditing ? (
            <TextInput
              style={styles.nameInput}
              value={item.name}
              onChangeText={(text) => onUpdate({ name: text })}
              placeholder="Item name"
            />
          ) : (
            <Text style={[styles.name, item.isChecked && styles.nameChecked]} numberOfLines={2}>
              {item.name}
            </Text>
          )}
          {tagName && <Text style={styles.tag}>{tagName}</Text>}
        </View>

        {/* Quantity */}
        {(item.quantity || isEditing) ? (
          <View style={styles.qtyContainer}>
            {isEditing ? (
              <TextInput
                style={[styles.qtyInput, { minWidth: 40 }]}
                value={item.quantity}
                onChangeText={(text) => {
                  onUpdate({ quantity: text });
                }}
                placeholder="Qty"
                selectTextOnFocus
              />
            ) : (
              <Text style={styles.qtyText}>
                {toLocalizedDigits(item.quantity || '', language)}
              </Text>
            )}
            {item.unit && <Text style={styles.unit}>{item.unit}</Text>}
          </View>
        ) : null}

        {/* Price */}
        {isEditing ? (
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
        ) : (
          <Text style={styles.priceText}>
            {item.price > 0 ? formatCurrency(item.price, currencySymbol, language) : ''}
          </Text>
        )}

      {!isEditing && <Pressable onPress={onDelete} style={styles.deleteBtn} hitSlop={8} disabled={false}>
          <Ionicons name="close" size={24} color={theme.colors.text} />
       </Pressable>}
      </Pressable>
    </ReanimatedSwipeable>
  );
};

// Simplified row for adding new items inline
interface AddItemRowProps {
  placeholder: string;
  currencySymbol?: string;
  onSubmit: (name: string, quantity?: string, price?: number) => void;
}

export const AddItemRow: FC<AddItemRowProps> = ({
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
      {/* Checkbox Placeholder - Moved to Right */}
      <View style={styles.checkbox}>
        <View style={styles.uncheckedCircleFaded} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.gap(3),
    marginHorizontal: theme.gap(5),
    paddingHorizontal: theme.gap(3),
    marginBottom: theme.gap(3),
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    gap: 10,
  },
  swipeContainer: {
    marginBottom: 8,
  },
  swipeAction: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
  },
  swipeLeft: {
    backgroundColor: theme.colors.destructive,
    marginRight: -10, // Overlap slightly
  },
  swipeRight: {
    backgroundColor: theme.colors.success || '#10B981', // Fallback if success not in theme
    marginLeft: -10,
  },
  swipeBtn: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
  nameInput: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.semiBold,
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
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
  qtyText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.regular,
    minWidth: 24,
    textAlign: 'center',
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
  priceText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.semiBold,
    minWidth: 60,
    textAlign: 'right',
  },
  pricePlaceholder: {
    color: theme.colors.textMuted,
  },
  deleteBtn: {
    padding: 0,
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
    marginHorizontal: theme.gap(5),

    // marginTop: theme.gap(2),
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

export default withUniTheme(BazaarItemRow);
