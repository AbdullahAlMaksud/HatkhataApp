import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { FC } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface ProfileCardProps {
  name: string;
  avatar?: string;
  onPress: () => void;
  syncActive: string;
  lastSynced: string;
}

const ProfileCard: FC<ProfileCardProps> = ({ name, avatar, onPress, syncActive, lastSynced }) => {
  return (
    <Pressable style={styles.profileCard} onPress={onPress}>
      <View style={styles.avatarPlaceholder}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatarImage} />
        ) : (
          <Ionicons name="person" size={24} color={styles.avatarIcon.color} />
        )}
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{name}</Text>
        {/* <Text style={styles.profileSubtitle}>
          {syncActive} • {lastSynced}
        </Text> */}
      </View>
      <Ionicons name="arrow-forward" size={20} color={styles.qrIcon.color} />
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
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
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
}));

export default ProfileCard;
