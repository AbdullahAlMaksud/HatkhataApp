import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { SettingsSectionHeader } from '@/components/SettingsRow';
import { useUserStore } from '@/store';

export default function ProfileScreen() {
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

  const handleSave = () => {
    setProfile({
      name: name.trim() || profile.name,
      username: username.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      bio: bio.trim() || undefined,
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
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={styles.backText}>{'< Settings'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{t('editProfile')}</Text>
        <Pressable onPress={handleSave} hitSlop={8}>
          <Text style={styles.saveBtn}>{tc('save')}</Text>
        </Pressable>
      </View>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={styles.avatarIcon.color} />
          <View style={styles.editBadge}>
            <Ionicons name="pencil" size={12} color="#FFFFFF" />
          </View>
        </View>
        <Text style={styles.changePhotoText}>{t('changePhoto')}</Text>
      </View>

      {/* Public Profile */}
      <SettingsSectionHeader title={t('publicProfile')} />
      <View style={styles.card}>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>{t('name')}</Text>
          <TextInput
            style={styles.fieldInput}
            value={name}
            onChangeText={setName}
            placeholder="..."
            placeholderTextColor={styles.placeholder.color}
          />
          {name.length > 0 && (
            <Pressable onPress={() => setName('')}>
              <Ionicons name="close-circle" size={18} color={styles.clearIcon.color} />
            </Pressable>
          )}
        </View>
        <View style={styles.divider} />
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>{t('username')}</Text>
          <TextInput
            style={styles.fieldInput}
            value={username}
            onChangeText={setUsername}
            placeholder="@username"
            placeholderTextColor={styles.placeholder.color}
            autoCapitalize="none"
          />
        </View>
      </View>
      <Text style={styles.hint}>{t('usernameNote')}</Text>

      {/* Contact Info */}
      <SettingsSectionHeader title={t('contactInfo')} />
      <View style={styles.card}>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>{t('email')}</Text>
          <TextInput
            style={styles.fieldInput}
            value={email}
            onChangeText={setEmail}
            placeholder="email@example.com"
            placeholderTextColor={styles.placeholder.color}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>{t('phone')}</Text>
          <TextInput
            style={styles.fieldInput}
            value={phone}
            onChangeText={setPhone}
            placeholder="+880 1XXX-XXXXXX"
            placeholderTextColor={styles.placeholder.color}
            keyboardType="phone-pad"
          />
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.primary,
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.bold,
  },
  saveBtn: {
    fontSize: theme.fontSize.base,
    color: theme.colors.primary,
  },
  // Avatar
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
  // Cards
  card: {
    backgroundColor: theme.colors.card,
    marginHorizontal: 16,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  fieldLabel: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.semiBold,
    minWidth: 80,
  },
  fieldInput: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.regular,
    padding: 0,
  },
  placeholder: {
    color: theme.colors.textMuted,
  },
  clearIcon: {
    color: theme.colors.textMuted,
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
