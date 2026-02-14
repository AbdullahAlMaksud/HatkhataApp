import * as FileSystem from 'expo-file-system';
import { Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

import {
  AvatarSection,
  ProfileField,
  ProfileHeader,
  SettingsSectionHeader,
} from '@/components';
import { useUserStore } from '@/store';

const ProfileScreen = () => {
  const { t } = useTranslation('profile');
  const { t: tc } = useTranslation('common');
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const profile = useUserStore((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile);

  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username || '');
  const [email, setEmail] = useState(profile.email || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [avatar, setAvatar] = useState(profile.avatar);

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      try {
        const fileName = selectedUri.split('/').pop();
        const newPath = Paths.document + '/' + (fileName || 'avatar.jpg');
        
        await FileSystem.copyAsync({
          from: selectedUri,
          to: newPath,
        });
        
        setAvatar(newPath);
      } catch {
        setAvatar(selectedUri);
      }
    }
  };

  const handleSave = () => {
    setProfile({
      name: name.trim() || profile.name,
      username: username.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      bio: bio.trim() || undefined,
      avatar: avatar,
    });
    router.back();
  };

  const handleDeleteAccount = () => {
    Alert.alert(t('deleteAccount'), t('deleteAccountConfirm'), [
      { text: tc('cancel'), style: 'cancel' },
      {
        text: t('deleteAccount'),
        style: 'destructive',
        onPress: () => {
          useUserStore.getState().signOut();
          router.replace('/onboarding');
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ProfileHeader
        title={t('editProfile')}
        onBack={() => router.back()}
        onSave={handleSave}
      />

      <AvatarSection
        changePhotoText={t('changePhoto')}
        imageUri={avatar}
        onPress={handlePickImage}
      />

      {/* Public Profile */}
      <SettingsSectionHeader title={t('publicProfile')} />
      <View style={styles.card}>
        <ProfileField
          label={t('name')}
          value={name}
          onChange={setName}
          placeholder="..."
          showClearButton
          onClear={() => setName('')}
        />
        <View style={styles.divider} />
        <ProfileField
          label={t('username')}
          value={username}
          onChange={setUsername}
          placeholder="@username"
          autoCapitalize="none"
        />
      </View>
      <Text style={styles.hint}>{t('usernameNote')}</Text>

      {/* Contact Info */}
      <SettingsSectionHeader title={t('contactInfo')} />
      <View style={styles.card}>
        <ProfileField
          label={t('email')}
          value={email}
          onChange={setEmail}
          placeholder="email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.divider} />
        <ProfileField
          label={t('phone')}
          value={phone}
          onChange={setPhone}
          placeholder="+880 1XXX-XXXXXX"
          keyboardType="phone-pad"
        />
      </View>

      {/* Bio */}
      <SettingsSectionHeader title={t('bio')} />
      <View style={styles.card}>
        <TextInput
          style={styles.bioInput}
          value={bio}
          onChangeText={setBio}
          placeholder={t('bioPlaceholder')}
          placeholderTextColor={styles.placeholder.color}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Delete Account */}
      <Pressable style={styles.deleteBtn} onPress={handleDeleteAccount}>
        <Text style={styles.deleteText}>{t('deleteAccount')}</Text>
      </Pressable>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: theme.colors.card,
    marginHorizontal: 16,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.borderLight,
    marginLeft: 16,
  },
  hint: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    paddingHorizontal: 20,
    marginTop: 6,
    lineHeight: 16,
  },
  bioInput: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.regular,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  placeholder: {
    color: theme.colors.textMuted,
  },
  deleteBtn: {
    marginHorizontal: 16,
    marginTop: 30,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.destructive,
    backgroundColor: theme.colors.card,
  },
  deleteText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.destructive,
  },
}));

export default ProfileScreen;
