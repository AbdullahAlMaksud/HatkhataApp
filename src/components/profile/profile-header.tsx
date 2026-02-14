import { WithTheme, withUniTheme } from '@/styles/hoc/with-unistyles';
import { MaterialIcons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface ProfileHeaderProps extends WithTheme {
  title: string;
  onBack: () => void;
  onSave: () => void;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({
  title,
  onBack,
  onSave,
  theme,
}) => {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} hitSlop={8}>
        <MaterialIcons name="arrow-back" size={24} color={theme.colors.primary} />
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
      <Pressable onPress={onSave} hitSlop={8}>
        <MaterialIcons name="save" size={24} color={theme.colors.primary} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.primary,
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.bold,
  },
  saveBtn: {
    fontSize: theme.fontSize.base,
    color: theme.colors.primary,
  },
}));

export default withUniTheme(ProfileHeader);
