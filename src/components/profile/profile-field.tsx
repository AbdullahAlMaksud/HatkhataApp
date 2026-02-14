import { Ionicons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface ProfileFieldProps extends Omit<TextInputProps, 'style' | 'placeholderTextColor' | 'onChange'> {
  label: string;
  value: string;
  onChange: (text: string) => void;
  showClearButton?: boolean;
  onClear?: () => void;
}

const ProfileField: FC<ProfileFieldProps> = ({
  label,
  value,
  onChange,
  showClearButton = false,
  onClear,
  ...textInputProps
}) => {
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChange}
        placeholderTextColor={styles.placeholder.color}
        {...textInputProps}
      />
      {showClearButton && value.length > 0 && onClear && (
        <Pressable onPress={onClear}>
          <Ionicons name="close-circle" size={18} color={styles.clearIcon.color} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  fieldLabel: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.semiBold,
    minWidth: 80,
  },
  fieldInput: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.regular,
    padding: 0,
  },
  placeholder: {
    color: theme.colors.textMuted,
  },
  clearIcon: {
    color: theme.colors.textMuted,
  },
}));

export default ProfileField;
