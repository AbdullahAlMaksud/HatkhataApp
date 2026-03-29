import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { StyleSheet } from 'react-native-unistyles';

import {
  AppLogo,
  GetStartedButton,
  LanguageToggle,
  NameInput,
  WelcomeSection,
} from './components';
import { useSettingsStore, useUserStore } from '@/store';

const OnboardingScreen = () => {
  const { t } = useTranslation('onboarding');
  const router = useRouter();
  const completeOnboarding = useUserStore(s => s.completeOnboarding);
  const language = useSettingsStore(s => s.language);
  const setLanguage = useSettingsStore(s => s.setLanguage);

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bottomOffset={Platform.OS === 'ios' ? 40 : 20}
        enabled={true}>
        {/* Language Toggle - top right */}
        <LanguageToggle label={t('languageToggle')} onToggle={toggleLanguage} />

        {/* Name Input - near the top for easy keyboard access */}
        <View style={styles.nameSection}>
          <NameInput
            label={`${t('enterName')} (${language === 'bn' ? 'Enter your name' : t('enterName')})`}
            placeholder={t('namePlaceholder')}
            value={name}
            onChange={setName}
          />
        </View>

        {/* App Logo */}
        <AppLogo />

        {/* Welcome Text */}
        <WelcomeSection
          welcome={t('welcome')}
          appName={t('appName')}
          descriptionBn={t('descriptionBn')}
          descriptionEn={t('descriptionEn')}
        />

        {/* Spacer to push button toward bottom */}
        <View style={styles.spacer} />

        {/* Get Started Button + Terms */}
        <View style={styles.bottomSection}>
          <GetStartedButton
            label={`${t('getStarted')} (${language === 'bn' ? 'Get Started' : t('getStarted')})`}
            onPress={handleGetStarted}
            disabled={!name.trim()}
          />

          <Text style={styles.termsText}>
            {t('termsText')}{' '}
            <Text style={styles.termsLink}>{t('termsLink')}</Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    flexGrow: 1,
  },
  nameSection: {
    marginTop: 20,
    marginBottom: 8,
  },
  spacer: {
    flex: 1,
    minHeight: 24,
  },
  bottomSection: {
    marginTop: 16,
    paddingBottom: 8,
  },
  termsText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 12,
  },
  termsLink: {
    color: theme.colors.primary,
  },
}));

export default OnboardingScreen;
