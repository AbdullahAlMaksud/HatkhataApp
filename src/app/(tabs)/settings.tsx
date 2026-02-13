import { File, Paths } from 'expo-file-system';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useState } from 'react';
import { Alert, Linking, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import {
  SettingsRow,
  SettingsSectionHeader,
  SettingsToggleRow,
} from '@/components/SettingsRow';
import { useListStore, useSettingsStore, useUserStore } from '@/store';
import { FONT_FAMILIES, FONT_WEIGHT_MAP } from '@/styles/theme/fonts';
import type { FontFamily, ThemeMode } from '@/types';

const CURRENCIES = [
  { code: 'BDT', symbol: '৳', label: 'টাকা (৳)', labelEn: 'Taka (৳)' },
  { code: 'USD', symbol: '$', label: 'ডলার ($)', labelEn: 'Dollar ($)' },
  { code: 'INR', symbol: '₹', label: 'রুপি (₹)', labelEn: 'Rupee (₹)' },
  { code: 'EUR', symbol: '€', label: 'ইউরো (€)', labelEn: 'Euro (€)' },
  { code: 'GBP', symbol: '£', label: 'পাউন্ড (£)', labelEn: 'Pound (£)' },
];

export default function SettingsScreen() {
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
      const header = 'Date,List Title,Notes,Item Name,Quantity,Price,Status\n';
      const rows = lists.flatMap((list) =>
        list.items.map((item) => {
          const date = new Date(list.createdAt).toLocaleDateString();
          const status = item.isChecked ? 'Completed' : 'Pending';
          return `"${date}","${list.title}","${list.notes || ''}","${item.name}","${item.quantity || ''}","${item.price}","${status}"`;
        }),
      );

      const csvContent = header + rows.join('\n');
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

  const themeModes: ThemeMode[] = ['light', 'dark', 'system'];
  const currentFontLabel = FONT_FAMILIES.find((f) => f.key === settings.fontFamily)?.label ?? settings.fontFamily;
  const currentCurrency = CURRENCIES.find((c) => c.code === settings.currency);
  const currentCurrencyLabel = settings.language === 'bn'
    ? (currentCurrency?.label ?? settings.currencySymbol)
    : (currentCurrency?.labelEn ?? settings.currencySymbol);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Text style={styles.title}>{t('title')}</Text>

      {/* Profile Card */}
      <Pressable
        style={styles.profileCard}
        onPress={() => router.push('/profile')}
      >
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={24} color={styles.avatarIcon.color} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileSubtitle}>
            {t('syncActive')} • {t('lastSynced')}
          </Text>
        </View>
        <Ionicons name="qr-code-outline" size={20} color={styles.qrIcon.color} />
      </Pressable>

      {/* Appearance */}
      <SettingsSectionHeader title={t('appearance')} />
      <View style={styles.card}>
        {/* Theme Switcher */}
        <View style={styles.themeSwitcher}>
          {themeModes.map((mode) => (
            <Pressable
              key={mode}
              style={[
                styles.themeOption,
                settings.themeMode === mode && styles.themeOptionActive,
              ]}
              onPress={() => handleThemeChange(mode)}
            >
              <Text
                style={[
                  styles.themeLabel,
                  settings.themeMode === mode && styles.themeLabelActive,
                ]}
              >
                {t(mode)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

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
      <View style={styles.previewCard}>
        <Text style={styles.previewTitle}>
          {t('previewText')}
        </Text>
        <Text style={styles.previewSubtext}>
          {t('previewSubtext', { currency: settings.currencySymbol })}
        </Text>
        <View style={styles.previewPriceRow}>
          <Text style={styles.previewPriceLabel}>
            {t('previewTotal')}
          </Text>
          <Text style={styles.previewPrice}>
            {settings.currencySymbol} 350
          </Text>
        </View>
      </View>

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
                ? 'সাহায্যের জন্য ইমেইল করুন:\nsupport@bazaarlist.app'
                : 'For help, email us at:\nsupport@bazaarlist.app',
              [{ text: 'OK' }],
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

      {/* App Info */}
      <View style={styles.appInfo}>
        <View style={styles.appInfoIcon}>
          <Ionicons name="book" size={24} color={styles.appInfoIconColor.color} />
        </View>
        <Text style={styles.appInfoName}>Hatkhata</Text>
        <Text style={styles.appInfoVersion}>
          {t('version', { version: '1.2.0', build: '45' })}
        </Text>
        <Text style={styles.appInfoMade}>{t('madeWith')}</Text>
      </View>

      {/* Sign Out */}
      <Pressable style={styles.signOutBtn} onPress={handleSignOut}>
        <Text style={styles.signOutText}>{t('signOut')}</Text>
      </Pressable>

      <View style={{ height: 40 }} />

      {/* Font Picker Modal */}
      <Modal
        visible={showFontPicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFontPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('selectFont')}</Text>
            <Pressable onPress={() => setShowFontPicker(false)} hitSlop={8}>
              <Ionicons name="close" size={24} color={styles.modalClose.color} />
            </Pressable>
          </View>
          <ScrollView style={styles.modalBody}>
            {FONT_FAMILIES.map((font) => {
              const weights = FONT_WEIGHT_MAP[font.key];
              const isSelected = settings.fontFamily === font.key;
              return (
                <Pressable
                  key={font.key}
                  style={[
                    styles.fontOption,
                    isSelected && styles.fontOptionSelected,
                  ]}
                  onPress={() => handleFontChange(font.key)}
                >
                  <View style={styles.fontOptionInfo}>
                    <Text
                      style={[
                        styles.fontOptionLabel,
                        { fontFamily: weights.bold },
                      ]}
                    >
                      {font.label}
                    </Text>
                    <Text
                      style={[
                        styles.fontOptionSample,
                        { fontFamily: weights.regular },
                      ]}
                    >
                      {settings.language === 'bn'
                        ? 'আজকের বাজারের তালিকা ১২৩'
                        : "Today's bazaar list 123"}
                    </Text>
                  </View>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={styles.checkIcon.color}
                    />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Modal>

      {/* Currency Picker Modal */}
      <Modal
        visible={showCurrencyPicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCurrencyPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('selectCurrency')}</Text>
            <Pressable onPress={() => setShowCurrencyPicker(false)} hitSlop={8}>
              <Ionicons name="close" size={24} color={styles.modalClose.color} />
            </Pressable>
          </View>
          <ScrollView style={styles.modalBody}>
            {CURRENCIES.map((cur) => {
              const isSelected = settings.currency === cur.code;
              return (
                <Pressable
                  key={cur.code}
                  style={[
                    styles.currencyOption,
                    isSelected && styles.currencyOptionSelected,
                  ]}
                  onPress={() => handleCurrencyChange(cur.code, cur.symbol)}
                >
                  <Text style={styles.currencySymbol}>{cur.symbol}</Text>
                  <View style={styles.currencyInfo}>
                    <Text style={styles.currencyLabel}>
                      {settings.language === 'bn' ? cur.label : cur.labelEn}
                    </Text>
                    <Text style={styles.currencyCode}>{cur.code}</Text>
                  </View>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={styles.checkIcon.color}
                    />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: 20,
    // paddingTop: rt.insets.top
  },
  title: {
    fontSize: theme.fontSize['3xl'],
    color: theme.colors.text,
    fontFamily: theme.fontFamily.bold,
    textAlign: 'center',
    paddingTop: 16,
    paddingBottom: 16,
  },
  // Profile Card
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    marginHorizontal: 16,
    borderRadius: theme.borderRadius.xl,
    padding: 16,
    gap: 12,
    ...theme.shadows.xs,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFE0B2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIcon: {
    color: '#F57C00',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.bold,
  },
  profileSubtitle: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  qrIcon: {
    color: theme.colors.textMuted,
  },
  // Cards
  card: {
    backgroundColor: theme.colors.card,
    marginHorizontal: 16,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.borderLight,
    marginLeft: 60,
  },
  // Theme Switcher
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
  // Preview
  previewCard: {
    backgroundColor: theme.colors.card,
    marginHorizontal: 16,
    borderRadius: theme.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  previewTitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.bold,
  },
  previewSubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    fontFamily: theme.fontFamily.regular,
    marginTop: 4,
  },
  previewPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  previewPriceLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.medium,
  },
  previewPrice: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.bold,
  },
  // App Info
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appInfoIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  appInfoIconColor: {
    color: '#FFFFFF',
  },
  appInfoName: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.bold,
  },
  appInfoVersion: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  appInfoMade: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  // Sign Out
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
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: rt.insets.top,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  modalTitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.bold,
  },
  modalClose: {
    color: theme.colors.text,
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  // Font picker
  fontOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  fontOptionSelected: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: theme.colors.primary + '08',
  },
  fontOptionInfo: {
    flex: 1,
  },
  fontOptionLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.bold,
    marginBottom: 4,
  },
  fontOptionSample: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  checkIcon: {
    color: theme.colors.primary,
  },
  // Currency picker
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    gap: 12,
  },
  currencyOptionSelected: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: theme.colors.primary + '08',
  },
  currencySymbol: {
    fontSize: theme.fontSize['2xl'],
    color: theme.colors.primary,
    width: 36,
    textAlign: 'center',
    fontFamily: theme.fontFamily.bold,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.bold,
  },
  currencyCode: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
}));
