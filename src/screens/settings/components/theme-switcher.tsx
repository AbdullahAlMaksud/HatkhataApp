import type { ThemeMode } from '@/types';
import React, { FC } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface ThemeSwitcherProps {
  currentMode: ThemeMode;
  onModeChange: (mode: ThemeMode) => void;
  labels: { light: string; dark: string; system: string };
}

const ThemeSwitcher: FC<ThemeSwitcherProps> = ({ currentMode, onModeChange, labels }) => {
  const themeModes: ThemeMode[] = ['light', 'dark', 'system'];

  return (
    <View style={styles.card}>
      <View style={styles.themeSwitcher}>
        {themeModes.map((mode) => (
          <Pressable
            key={mode}
            style={[styles.themeOption, currentMode === mode && styles.themeOptionActive]}
            onPress={() => onModeChange(mode)}
          >
            <Text style={[styles.themeLabel, currentMode === mode && styles.themeLabelActive]}>
              {labels[mode]}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.card,
    marginHorizontal: 16,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    overflow: 'hidden',
  },
  themeSwitcher: {
    flexDirection: 'row',
    margin: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 4,
  },
  themeOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
  },
  themeOptionActive: {
    backgroundColor: theme.colors.card,
    ...theme.shadows.xs,
  },
  themeLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
  themeLabelActive: {
    color: theme.colors.text,
  },
}));

export default ThemeSwitcher;
