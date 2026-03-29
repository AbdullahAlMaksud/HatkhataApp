import { Ionicons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const AppLogo: FC = () => {
  return (
    <View style={styles.logoContainer}>
      <View style={styles.logoBox}>
        <Ionicons name="cart" size={48} color="#FFFFFF" />
      </View>
      <View style={styles.logoBadge}>
        <Text style={styles.logoBadgeText}>৳</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
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
}));

export default AppLogo;
