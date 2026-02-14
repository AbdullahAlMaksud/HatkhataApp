import React, { FC } from 'react';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface WelcomeSectionProps {
  welcome: string;
  appName: string;
  descriptionBn: string;
  descriptionEn: string;
}

const WelcomeSection: FC<WelcomeSectionProps> = ({
  welcome,
  appName,
  descriptionBn,
  descriptionEn,
}) => {
  return (
    <>
      <Text style={styles.welcomeText}>{welcome}</Text>
      <Text style={styles.appName}>{appName}</Text>
      <Text style={styles.descriptionBn}>{descriptionBn}</Text>
      <Text style={styles.descriptionEn}>{descriptionEn}</Text>
    </>
  );
};

const styles = StyleSheet.create((theme) => ({
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
}));

export default WelcomeSection;
