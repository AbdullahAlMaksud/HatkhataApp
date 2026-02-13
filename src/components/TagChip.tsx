import React from 'react';
import { Pressable, Text, View, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface TagChipProps {
  name: string;
  color: string;
  isSelected?: boolean;
  onPress?: () => void;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const TagChip: React.FC<TagChipProps> = ({
  name,
  color,
  isSelected = false,
  onPress,
  size = 'md',
  style,
}) => {
  const content = (
    <>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text
        style={[
          styles.label,
          size === 'sm' && styles.labelSm,
          isSelected && styles.labelSelected,
        ]}
        numberOfLines={1}
      >
        {name}
      </Text>
    </>
  );

  const containerStyle = [
    styles.chip,
    size === 'sm' && styles.chipSm,
    isSelected && styles.chipSelected,
    isSelected && { borderColor: color },
    style,
  ];

  if (onPress) {
    return (
      <Pressable style={containerStyle} onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return <View style={containerStyle}>{content}</View>;
};

const styles = StyleSheet.create((theme) => ({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipSm: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chipSelected: {
    backgroundColor: theme.colors.primaryLight,
    borderWidth: 1.5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  label: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.medium,
  },
  labelSm: {
    fontSize: theme.fontSize.xs,
  },
  labelSelected: {
    fontFamily: theme.fontFamily.semiBold,
  },
}));
