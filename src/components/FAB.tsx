import React from 'react';
import { Pressable, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Ionicons } from '@expo/vector-icons';

interface FABProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}

export const FAB: React.FC<FABProps> = ({ onPress, icon = 'add', style }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.fab,
        pressed && styles.fabPressed,
        style,
      ]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={20} color="#FFFFFF" />
    </Pressable>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  fab: {
    position: 'absolute',
    bottom: rt.insets.bottom + 14,
    right: rt.insets.right + 24,
    width: theme.gap(14),
    height: theme.gap(14),
    borderRadius: theme.gap(14),
    backgroundColor: theme.colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
    zIndex: 100,
  },
  fabPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }],
  },
}));
