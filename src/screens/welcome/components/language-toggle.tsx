import { Ionicons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface LanguageToggleProps {
  label: string;
  onToggle: () => void;
}

const LanguageToggle: FC<LanguageToggleProps> = ({ label, onToggle }) => {
  return (
    <View style={styles.langContainer}>
      <Pressable style={styles.langButton} onPress={onToggle}>
        <Ionicons name="language" size={18} color={styles.langText.color} />
        <Text style={styles.langText}>{label}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  langContainer: {
    alignItems: 'flex-end',
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  langText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
}));

export default LanguageToggle;
