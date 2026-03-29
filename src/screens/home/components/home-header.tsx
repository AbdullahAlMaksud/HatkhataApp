import { WithTheme, withUniTheme } from '@/styles/hoc/with-unistyles';
import { Ionicons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

interface HomeHeaderProps extends WithTheme {
  onSearchToggle: () => void;
  onFilterPress: () => void;
  onTagsPress: () => void;
  onSettingsPress: () => void;
  isSearching: boolean;
}

const HomeHeader: FC<HomeHeaderProps> = ({
  onSearchToggle,
  onFilterPress,
  onTagsPress,
  onSettingsPress,
  isSearching,
  theme,
}) => {
  const { t } = useTranslation('home');
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.header(insets.top)}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('title')}</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            style={[styles.headerBtn, isSearching && styles.headerBtnActive]}
            onPress={onSearchToggle}
          >
            <Ionicons
              name={isSearching ? 'close' : 'search'}
              size={20}
              color={isSearching ? theme.colors.primaryForeground : theme.colors.text}
            />
          </Pressable>
          <Pressable style={styles.headerBtn} onPress={onFilterPress}>
            <Ionicons name="options-outline" size={20} color={theme.colors.text} />
          </Pressable>
          <Pressable style={styles.headerBtn} onPress={onTagsPress}>
            <Ionicons name="pricetag-outline" size={20} color={theme.colors.text} />
          </Pressable>
          <Pressable style={styles.headerBtn} onPress={onSettingsPress}>
            <Ionicons name="settings-outline" size={20} color={theme.colors.text} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  header: (topInset: number) => ({
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: theme.gap(5),
    paddingTop: topInset + theme.gap(8),
    paddingBottom: theme.gap(6),
    borderBottomLeftRadius: theme.gap(6),
    borderBottomRightRadius: theme.gap(6),
    marginBottom: theme.gap(2),
    backgroundColor: theme.colors.primary,
  }),
  headerRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSize['3xl'],
    color: theme.colors.textInverse,
    fontFamily: theme.fontFamily.bold,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  headerBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  headerBtnIcon: {
    color: theme.colors.text,
  },
}));

export default withUniTheme(HomeHeader);
