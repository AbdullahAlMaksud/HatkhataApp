import React from 'react';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface UrgentBadgeProps {
  label: string;
  variant?: 'urgent' | 'weekly' | 'default';
}

const UrgentBadge: React.FC<UrgentBadgeProps> = ({
  label,
  variant = 'default',
}) => {
  return (
    <View
      style={[
        styles.badge,
        variant === 'urgent' && styles.urgentBadge,
        variant === 'weekly' && styles.weeklyBadge,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'urgent' && styles.urgentLabel,
          variant === 'weekly' && styles.weeklyLabel,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
  },
  urgentBadge: {
    backgroundColor: theme.colors.urgentLight,
  },
  weeklyBadge: {
    backgroundColor: theme.colors.primaryLight,
  },
  label: {
    fontSize: theme.fontSize.xxs,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.semiBold,
  },
  urgentLabel: {
    color: theme.colors.urgent,
  },
  weeklyLabel: {
    color: theme.colors.primary,
  },
}));

export default UrgentBadge;
