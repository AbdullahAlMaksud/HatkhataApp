import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import CustomSwitch from './custom-switch';

import { Ionicons } from '@expo/vector-icons';

interface SettingsRowProps {
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBgColor?: string;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  showExternalLink?: boolean;
}

interface SettingsToggleRowProps {
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBgColor?: string;
  label: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}

const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  iconColor,
  iconBgColor,
  label,
  value,
  onPress,
  showChevron = true,
  showExternalLink = false,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && onPress && styles.rowPressed]}
      onPress={onPress}
    >
      {icon && (
        <View style={[styles.iconBox, iconBgColor ? { backgroundColor: iconBgColor } : undefined]}>
          <Ionicons name={icon} size={18} color={iconColor || styles.iconDefault.color} />
        </View>
      )}
      <Text style={styles.label}>{label}</Text>
      <View style={styles.right}>
        {value && <Text style={styles.value}>{value}</Text>}
        {showChevron && (
          <Ionicons name="chevron-forward" size={16} color={styles.chevron.color} />
        )}
        {showExternalLink && (
          <Ionicons name="open-outline" size={14} color={styles.chevron.color} />
        )}
      </View>
    </Pressable>
  );
};

export const SettingsToggleRow: React.FC<SettingsToggleRowProps> = ({
  icon,
  iconColor,
  iconBgColor,
  label,
  value,
  onToggle,
}) => {
  return (
    <View style={styles.row}>
      {icon && (
        <View style={[styles.iconBox, iconBgColor ? { backgroundColor: iconBgColor } : undefined]}>
          <Ionicons name={icon} size={18} color={iconColor || styles.iconDefault.color} />
        </View>
      )}
      <Text style={styles.label}>{label}</Text>
      <CustomSwitch
        value={value}
        onValueChange={onToggle}
        activeColor={styles.switchTrackActive.backgroundColor}
        inactiveColor={styles.switchTrack.backgroundColor}
      />
    </View>
  );
};

export const SettingsSectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  rowPressed: {
    opacity: 0.7,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  iconDefault: {
    color: theme.colors.text,
  },
  label: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.regular,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  value: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.regular,
  },
  chevron: {
    color: theme.colors.textMuted,
  },
  switchTrack: {
    backgroundColor: theme.colors.border,
  },
  switchTrackActive: {
    backgroundColor: theme.colors.primary,
  },
  sectionHeader: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    fontFamily: theme.fontFamily.semiBold,
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
}));

export default SettingsRow;
