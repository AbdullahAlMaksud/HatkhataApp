import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { FC } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface AvatarSectionProps {
  changePhotoText: string;
  imageUri?: string;
  onPress?: () => void;
}

const AvatarSection: FC<AvatarSectionProps> = ({ changePhotoText, imageUri, onPress }) => {
  return (
    <View style={styles.avatarSection}>
      <Pressable style={styles.avatar} onPress={onPress}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Ionicons name="person" size={40} color={styles.avatarIcon.color} />
        )}
        <View style={styles.editBadge}>
          <Ionicons name="pencil" size={12} color="#FFFFFF" />
        </View>
      </Pressable>
      <Text style={styles.changePhotoText}>{changePhotoText}</Text>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFE0B2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarIcon: {
    color: '#F57C00',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  changePhotoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    marginTop: 10,
  },
}));

export default AvatarSection;
