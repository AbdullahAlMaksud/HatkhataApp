import { File, Paths } from 'expo-file-system';
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
  SettingsRow,
  SettingsSectionHeader,
  SettingsToggleRow,
  ThemeSwitcher,
} from '@/components';
import { useListStore, useSettingsStore, useUserStore } from '@/store';
import { WithTheme, withUniTheme } from '@/styles/hoc/with-unistyles';
import { FONT_FAMILIES } from '@/styles/theme/fonts';
import type { FontFamily, ThemeMode } from '@/types';
import { toLocalizedDigits } from '@/utils/calculations';

const CURRENCIES = [
  { code: 'BDT', symbol: '৳', label: 'টাকা (৳)', labelEn: 'Taka (৳)' },
  { code: 'USD', symbol: '$', label: 'ডলার ($)', labelEn: 'Dollar ($)' },
  { code: 'INR', symbol: '₹', label: 'রুপি (₹)', labelEn: 'Rupee (₹)' },
  { code: 'EUR', symbol: '€', label: 'ইউরো (€)', labelEn: 'Euro (€)' },
  { code: 'GBP', symbol: '£', label: 'পাউন্ড (£)', labelEn: 'Pound (£)' },
];

const SettingsScreen:FC<WithTheme> = ({theme, rt}) => {
  const { t } = useTranslation('settings');
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const profile = useUserStore((s) => s.profile);
  const signOut = useUserStore((s) => s.signOut);
  const settings = useSettingsStore();
  const lists = useListStore((s) => s.lists);

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
      { text: 'Cancel', style: 'cancel' },
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
      const header = 'Date,List Title,Notes,Item Name,Quantity,Price,Status\\n';
      const rows = lists.flatMap((list) =>
        list.items.map((item) => {
          const date = new Date(list.createdAt).toLocaleDateString();
          const status = item.isChecked ? 'Completed' : 'Pending';
          return `\"${date}\",\"${list.title}\",\"${list.notes || ''}\",\"${item.name}\",\"${item.quantity || ''}\",\"${item.price}\",\"${status}\"`;
        })
      );

      const csvContent = header + rows.join('\\n');
      const file = new File(Paths.document, 'hatkhata_export.csv');
      if (!file.exists) {
        file.create();
      }
      file.write(csvContent);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri);
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
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
      <SettingsSectionHeader title={'Data Management'} />
      <View style={styles.card}>
        <SettingsRow
          icon="download-outline"
          label={'Export Data (CSV)'}
          value={'Save as .csv'}
          onPress={handleExportData}
          iconColor="#10B981"
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
              [{ text: 'OK' }]
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
        version={t('version', { version: toLocalizedDigits('1.2.0', settings.language), build: toLocalizedDigits('45', settings.language) })}
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
