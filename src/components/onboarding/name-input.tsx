import { Ionicons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { Text, TextInput, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface NameInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (text: string) => void;
}

const NameInput: FC<NameInputProps> = ({ label, placeholder, value, onChange }) => {
  return (
    <>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color={styles.inputIcon.color} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={styles.placeholder.color}
          value={value}
          onChangeText={onChange}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create((theme) => ({
  inputLabel: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius['2xl'],
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 10,
    marginBottom: 20,
  },
  inputIcon: {
    color: theme.colors.textMuted,
  },
  input: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.regular,
    padding: 0,
  },
  placeholder: {
    color: theme.colors.textMuted,
  },
}));

export default NameInput;
