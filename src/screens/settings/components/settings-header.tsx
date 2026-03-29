import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface SettingsHeaderProps {
  title: string;
}

const SettingsHeader: FC<SettingsHeaderProps> = ({ title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: theme.fontSize['3xl'],
    color: theme.colors.text,
    fontFamily: theme.fontFamily.bold,
    textAlign: 'center',
  },
}));

export default SettingsHeader;
