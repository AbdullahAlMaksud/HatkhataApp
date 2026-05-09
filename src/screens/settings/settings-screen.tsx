import { File, Paths } from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

import {
  AppInfo,
  CurrencyPickerModal,
  FontPickerModal,
  PreviewCard,
  ProfileCard,
  SettingsHeader,
  ThemeSwitcher,
} from './components';
import {
  SettingsRow,
  SettingsSectionHeader,
  SettingsToggleRow,
} from '@/components';
import { useListStore, useSettingsStore, useTagStore, useUserStore } from '@/store';
import { WithTheme, withUniTheme } from '@/styles/hoc/with-unistyles';
import { FONT_FAMILIES } from '@/styles/theme/fonts';
import type { FontFamily, ThemeMode } from '@/types';
import { toLocalizedDigits } from '@/utils/calculations';
import { buildBackupCsv, parseBackupCsv } from '@/utils/csv-backup';

const CURRENCIES = [
  { code: 'BDT', symbol: '৳', label: 'টাকা (৳)', labelEn: 'Taka (৳)' },
  { code: 'USD', symbol: '$', label: 'ডলার ($)', labelEn: 'Dollar ($)' },
  { code: 'INR', symbol: '₹', label: 'রুপি (₹)', labelEn: 'Rupee (₹)' },
  { code: 'EUR', symbol: '€', label: 'ইউরো (€)', labelEn: 'Euro (€)' },
  { code: 'GBP', symbol: '£', label: 'পাউন্ড (£)', labelEn: 'Pound (£)' },
];

const SettingsScreen:FC<WithTheme> = ({theme, rt}) => {
  const { t } = useTranslation('settings');
  const { t: tc } = useTranslation('common');
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const profile = useUserStore((s) => s.profile);
  const signOut = useUserStore((s) => s.signOut);
  const settings = useSettingsStore();
  const lists = useListStore((s) => s.lists);
  const replaceAllLists = useListStore((s) => s.replaceAllLists);
  const tags = useTagStore((s) => s.tags);
  const replaceAllTags = useTagStore((s) => s.replaceAllTags);

  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const handleThemeChange = (mode: ThemeMode) => {
    settings.setThemeMode(mode);
    if (mode === 'system') {
      UnistylesRuntime.setAdaptiveThemes(true);
    } else {
      UnistylesRuntime.setAdaptiveThemes(false);
      UnistylesRuntime.setTheme(mode);
    }
  };

  const handleLanguageChange = () => {
    const newLang = settings.language === 'bn' ? 'en' : 'bn';
    settings.setLanguage(newLang);
  };

  const handleFontChange = (font: FontFamily) => {
    settings.setFontFamily(font);
    setShowFontPicker(false);
  };

  const handleCurrencyChange = (code: string, symbol: string) => {
    settings.setCurrency(code, symbol);
    setShowCurrencyPicker(false);
  };

  const handleSignOut = () => {
    Alert.alert(t('signOut'), t('signOutConfirm'), [
      { text: tc('cancel'), style: 'cancel' },
      {
        text: t('signOut'),
        style: 'destructive',
        onPress: () => {
          signOut();
          router.replace('/onboarding');
        },
      },
    ]);
  };

  const handleExportData = async () => {
    try {
      const csvContent = buildBackupCsv({ lists, tags });
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      const file = new File(Paths.document, `hatkhata-backup-${timestamp}.csv`);
      file.create({ overwrite: true });
      file.write(csvContent);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri);
      } else {
        Alert.alert(t('exportSuccessTitle'), t('exportSavedMessage'));
      }
    } catch {
      Alert.alert(t('exportFailedTitle'), t('exportFailedMessage'));
    }
  };

  const handleRestoreData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'text/csv',
          'text/comma-separated-values',
          'application/csv',
          'application/vnd.ms-excel',
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled || result.assets.length === 0) {
        return;
      }

      const file = new File(result.assets[0].uri);
      const csvContent = await file.text();
      const parsedBackup = parseBackupCsv(csvContent);

      if (parsedBackup.summary.listCount === 0) {
        Alert.alert(t('noBackupDataTitle'), t('noBackupDataMessage'));
        return;
      }

      const localizedSummary = {
        lists: toLocalizedDigits(parsedBackup.summary.listCount, settings.language),
        items: toLocalizedDigits(parsedBackup.summary.itemCount, settings.language),
        tags: toLocalizedDigits(parsedBackup.summary.tagCount, settings.language),
      };

      Alert.alert(
        t('restoreConfirmTitle'),
        t('restoreConfirmMessage', localizedSummary),
        [
          { text: tc('cancel'), style: 'cancel' },
          {
            text: t('restoreNow'),
            style: 'destructive',
            onPress: () => {
              if (parsedBackup.hasExplicitTags) {
                replaceAllTags(parsedBackup.tags);
              }
              replaceAllLists(parsedBackup.lists);

              Alert.alert(
                t('restoreSuccessTitle'),
                t('restoreSuccessMessage', {
                  lists: localizedSummary.lists,
                  items: localizedSummary.items,
                }),
              );
            },
          },
        ],
      );
    } catch {
      Alert.alert(t('restoreFailedTitle'), t('restoreFailedMessage'));
    }
  };

  const currentFontLabel =
    FONT_FAMILIES.find((f) => f.key === settings.fontFamily)?.label ?? settings.fontFamily;
  const currentCurrency = CURRENCIES.find((c) => c.code === settings.currency);
  const currentCurrencyLabel =
    settings.language === 'bn'
      ? currentCurrency?.label ?? settings.currencySymbol
      : currentCurrency?.labelEn ?? settings.currencySymbol;

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <SettingsHeader title={t('title')} />

      <ProfileCard
        name={profile.name}
        avatar={profile.avatar}
        onPress={() => router.push('/profile')}
        syncActive={t('syncActive')}
        lastSynced={t('lastSynced')}
      />

      {/* Appearance */}
      <SettingsSectionHeader title={t('appearance')} />
      <ThemeSwitcher
        currentMode={settings.themeMode}
        onModeChange={handleThemeChange}
        labels={{ light: t('light'), dark: t('dark'), system: t('system') }}
      />

      <View style={styles.card}>
        <SettingsRow
          icon="text"
          label={t('appFont')}
          value={currentFontLabel}
          onPress={() => setShowFontPicker(true)}
          iconColor="#5C6BC0"
        />
      </View>

      {/* Preview */}
      <SettingsSectionHeader title={t('preview')} />
      <PreviewCard
        currencySymbol={settings.currencySymbol}
        previewText={t('previewText')}
        previewSubtext={t('previewSubtext', { currency: settings.currencySymbol })}
        previewTotal={t('previewTotal')}
        language={settings.language}
      />

      {/* Regional */}
      <SettingsSectionHeader title={t('regional')} />
      <View style={styles.card}>
        <SettingsRow
          icon="language"
          label={t('language')}
          value={settings.language === 'bn' ? t('languageBangla') : t('languageEnglish')}
          onPress={handleLanguageChange}
          iconColor="#3B82F6"
        />
        <View style={styles.divider} />
        <SettingsRow
          icon="wallet-outline"
          label={t('currency')}
          value={currentCurrencyLabel}
          onPress={() => setShowCurrencyPicker(true)}
          iconColor="#F59E0B"
        />
      </View>

      {/* List Options */}
      <SettingsSectionHeader title={t('listOptions')} />
      <View style={styles.card}>
        <SettingsToggleRow
          icon="grid-outline"
          label={t('showTotalPrice')}
          value={settings.showTotalPrice}
          onToggle={() => settings.toggleShowTotalPrice()}
          iconColor="#3B82F6"
        />
        <View style={styles.divider} />
        <SettingsToggleRow
          icon="swap-vertical-outline"
          label={t('moveCompleted')}
          value={settings.moveCompletedToBottom}
          onToggle={() => settings.toggleMoveCompletedToBottom()}
          iconColor="#8B5CF6"
        />
        <View style={styles.divider} />
        <SettingsToggleRow
          icon="phone-portrait-outline"
          label={t('hapticFeedback')}
          value={settings.hapticFeedback}
          onToggle={() => settings.toggleHapticFeedback()}
          iconColor="#EC4899"
        />
      </View>

      {/* Data Management */}
      <SettingsSectionHeader title={t('dataManagement')} />
      <View style={styles.card}>
        <SettingsRow
          icon="download-outline"
          label={t('exportData')}
          value={t('exportDataHint')}
          onPress={handleExportData}
          iconColor="#10B981"
        />
        <View style={styles.divider} />
        <SettingsRow
          icon="cloud-upload-outline"
          label={t('restoreData')}
          value={t('restoreDataHint')}
          onPress={handleRestoreData}
          iconColor="#2563EB"
        />
      </View>

      {/* Help & Privacy */}
      <View style={[styles.card, { marginTop: 20 }]}>
        <SettingsRow
          icon="help-circle-outline"
          label={t('helpSupport')}
          onPress={() => {
            Alert.alert(
              t('helpSupport'),
              settings.language === 'bn'
                ? 'সাহায্যের জন্য ইমেইল করুন:\\nsupport@bazaarlist.app'
                : 'For help, email us at:\\nsupport@bazaarlist.app',
              [{ text: tc('ok') }]
            );
          }}
        />
        <View style={styles.divider} />
        <SettingsRow
          icon="shield-checkmark-outline"
          label={t('privacyPolicy')}
          onPress={() => {
            Linking.openURL('https://bazaarlist.app/privacy');
          }}
          showExternalLink
          showChevron={false}
        />
      </View>

      <AppInfo
        appName={t('app-name')}
        version={t('version', { version: toLocalizedDigits('1.0.1', settings.language), build: toLocalizedDigits('46', settings.language) })}
        madeWith={t('madeWith')}
      />

      {/* Sign Out */}
      <Pressable style={styles.signOutBtn} onPress={handleSignOut}>
        <Text style={styles.signOutText}>{t('signOut')}</Text>
      </Pressable>

      <View style={{ height: rt.insets.bottom+ theme.gap(10) }} />

      <FontPickerModal
        visible={showFontPicker}
        onClose={() => setShowFontPicker(false)}
        currentFont={settings.fontFamily}
        onSelect={handleFontChange}
        language={settings.language}
        title={t('selectFont')}
      />

      <CurrencyPickerModal
        visible={showCurrencyPicker}
        onClose={() => setShowCurrencyPicker(false)}
        currentCurrency={settings.currency}
        onSelect={handleCurrencyChange}
        language={settings.language}
        title={t('selectCurrency')}
        currencies={CURRENCIES}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: theme.colors.card,
   marginHorizontal: 16,
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
    // overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.borderLight,
    marginLeft: 60,
  },
  signOutBtn: {
    marginHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.destructive,
    backgroundColor: theme.colors.card,
  },
  signOutText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.destructive,
    fontFamily: theme.fontFamily.bold,
  },
}));

export default withUniTheme(SettingsScreen);
