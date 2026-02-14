import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  AppLogo,
  GetStartedButton,
  LanguageToggle,
  NameInput,
  WelcomeSection,
} from '@/components';
import { useSettingsStore, useUserStore } from '@/store';

const OnboardingScreen = () => {
  const { t } = useTranslation('onboarding');
  const router = useRouter();
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  const [name, setName] = useState('');

  const handleGetStarted = () => {
    if (!name.trim()) return;
    completeOnboarding(name.trim());
    router.replace('/main');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LanguageToggle label={t('languageToggle')} onToggle={toggleLanguage} />

      <AppLogo />

      <WelcomeSection
        welcome={t('welcome')}
        appName={t('appName')}
        descriptionBn={t('descriptionBn')}
        descriptionEn={t('descriptionEn')}
      />

      <View style={styles.spacer} />

      <NameInput
        label={`${t('enterName')} (${language === 'bn' ? 'Enter your name' : t('enterName')})`}
        placeholder={t('namePlaceholder')}
        value={name}
        onChange={setName}
      />

      <GetStartedButton
        label={`${t('getStarted')} (${language === 'bn' ? 'Get Started' : t('getStarted')})`}
        onPress={handleGetStarted}
        disabled={!name.trim()}
      />

      <Text style={styles.termsText}>
        {t('termsText')} <Text style={styles.termsLink}>{t('termsLink')}</Text>
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
  },
  spacer: {
    flex: 1,
    minHeight: 30,
  },
  termsText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: theme.colors.primary,
  },
}));

export default OnboardingScreen;
