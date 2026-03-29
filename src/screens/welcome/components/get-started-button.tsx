import { Ionicons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { Pressable, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface GetStartedButtonProps {
  label: string;
  onPress: () => void;
  disabled: boolean;
}

const GetStartedButton: FC<GetStartedButtonProps> = ({ label, onPress, disabled }) => {
  return (
    <Pressable
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{label}</Text>
      <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius['2xl'],
    paddingVertical: 16,
    marginBottom: 16,
    ...theme.shadows.md,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: theme.fontSize.md,
    fontFamily: theme.fontFamily.bold,
    color: '#FFFFFF',
  },
}));

export default GetStartedButton;
