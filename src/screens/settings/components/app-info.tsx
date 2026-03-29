import logo from '@/assets/images/applogo/favicon.png';
import { Image } from 'expo-image';
import React, { FC } from 'react';
import { Linking, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface AppInfoProps {
  appName: string;
  version: string;
  madeWith: string;
}

const AppInfo: FC<AppInfoProps> = ({ appName, version, madeWith }) => {

  const onMadeWithPress = () => {
    Linking.openURL('https://abdullahalmaksud.com');
  };
  return (
    <View style={styles.appInfo}>
      <View style={styles.appInfoIcon}>
        <Image
          source={logo}
          style={{ width: 40, height: 40 }}
          contentFit="contain"
        />
      </View>
      <Text style={styles.appInfoName}>{appName}</Text>
      <Text style={styles.appInfoVersion}>{version}</Text>
      <Text onPress={onMadeWithPress} style={styles.appInfoMade}>&copy; {madeWith}</Text>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appInfoIcon: {
    width: 60,
    height: 60,
    borderRadius: 32,
    backgroundColor: theme.colors.primary + '1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  appInfoIconColor: {
    color: '#FFFFFF',
  },
  appInfoName: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.bold,
  },
  appInfoVersion: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  appInfoMade: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.tagTeal,
    // marginTop: theme.gap(2),
    lineHeight: theme.fontSize.xs * 1.4,
    // textDecorationLine: 'underline',
    // cursor: 'pointer',
  },
}));

export default AppInfo;
