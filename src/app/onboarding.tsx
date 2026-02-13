import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { useSettingsStore, useUserStore } from '@/store';

export default function OnboardingScreen() {
  const { t } = useTranslation('onboarding');
  const router = useRouter();
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  const [name, setName] = useState('');

  const handleGetStarted = () => {
    if (!name.trim()) return;
    completeOnboarding(name.trim());
    router.replace('/(tabs)');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Language Toggle */}
      <View style={styles.langContainer}>
        <Pressable style={styles.langButton} onPress={toggleLanguage}>
          <Ionicons name="language" size={18} color={styles.langText.color} />
          <Text style={styles.langText}>{t('languageToggle')}</Text>
        </Pressable>
      </View>

      {/* Logo / App Icon Area */}
      <View style={styles.logoContainer}>
        <View style={styles.logoBox}>
          <Ionicons name="cart" size={48} color="#FFFFFF" />
        </View>
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>৳</Text>
        </View>
      </View>

      {/* Welcome Text */}
      <Text style={styles.welcomeText}>{t('welcome')}</Text>
      <Text style={styles.appName}>{t('appName')}</Text>

      <Text style={styles.descriptionBn}>{t('descriptionBn')}</Text>
      <Text style={styles.descriptionEn}>{t('descriptionEn')}</Text>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Name Input */}
      <Text style={styles.inputLabel}>{t('enterName')} ({language === 'bn' ? 'Enter your name' : t('enterName')})</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color={styles.inputIcon.color} />
        <TextInput
          style={styles.input}
          placeholder={t('namePlaceholder')}
          placeholderTextColor={styles.placeholder.color}
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Get Started Button */}
      <Pressable
        style={[styles.button, !name.trim() && styles.buttonDisabled]}
        onPress={handleGetStarted}
        disabled={!name.trim()}
      >
        <Text style={styles.buttonText}>
          {t('getStarted')} ({language === 'bn' ? 'Get Started' : t('getStarted')})
        </Text>
        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
      </Pressable>

      {/* Terms */}
      <Text style={styles.termsText}>
        {t('termsText')}{' '}
        <Text style={styles.termsLink}>{t('termsLink')}</Text>
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
  langContainer: {
    alignItems: 'flex-end',
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  langText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  logoBox: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  logoBadge: {
    position: 'absolute',
    bottom: -4,
    right: '35%',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  logoBadgeText: {
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSize.base,
    color: theme.colors.primary,
  },
  welcomeText: {
    fontSize: theme.fontSize['3xl'],
    color: theme.colors.text,
    fontFamily: theme.fontFamily.bold,
    textAlign: 'center',
    marginTop: 16,
  },
  appName: {
    fontSize: theme.fontSize['4xl'],
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.bold,
    textAlign: 'center',
    marginBottom: 16,
  },
  descriptionBn: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.regular,
    textAlign: 'center',
    lineHeight: 22,
  },
  descriptionEn: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  spacer: {
    flex: 1,
    minHeight: 30,
  },
  inputLabel: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius['2xl'],
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 10,
    marginBottom: 20,
  },
  inputIcon: {
    color: theme.colors.textMuted,
  },
  input: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.regular,
    padding: 0,
  },
  placeholder: {
    color: theme.colors.textMuted,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius['2xl'],
    paddingVertical: 16,
    marginBottom: 16,
    ...theme.shadows.md,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: theme.fontSize.md,
    fontFamily: theme.fontFamily.bold,
    color: '#FFFFFF',
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
