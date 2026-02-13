import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const TAG_COLORS = [
  '#34C759',
  '#3B82F6',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#EF4444',
  '#EAB308',
  '#6366F1',
  '#06B6D4',
  '#F97316',
  '#84CC16',
];

interface CreateTagModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string, color: string) => void;
  initialData?: { name: string; color: string };
  error?: string | null;
}

export const CreateTagModal: React.FC<CreateTagModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  error,
}) => {
  const { t } = useTranslation('tags');
  const { t: tc } = useTranslation('common');

  const [name, setName] = useState(initialData?.name || '');
  const [color, setColor] = useState(initialData?.color || TAG_COLORS[0]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit(name.trim(), color);
    setName('');
    setColor(TAG_COLORS[0]);
  };

  const handleClose = () => {
    setName('');
    setColor(TAG_COLORS[0]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleClose} hitSlop={8}>
            <Ionicons name="close" size={24} color={styles.closeIcon.color} />
          </Pressable>
          <Text style={styles.headerTitle}>
            {initialData ? t('editTag') : t('createTag')}
          </Text>
          <Pressable
            onPress={handleSubmit}
            disabled={!name.trim()}
            hitSlop={8}
          >
            <Text
              style={[
                styles.saveButton,
                !name.trim() && styles.saveButtonDisabled,
              ]}
            >
              {tc('save')}
            </Text>
          </Pressable>
        </View>

        <ScrollView style={styles.body}>
          {/* Tag Name */}
          <Text style={styles.fieldLabel}>{t('tagName')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('tagNamePlaceholder')}
            placeholderTextColor={styles.placeholder.color}
            value={name}
            onChangeText={setName}
            autoFocus
          />
          {error && <Text style={styles.error}>{error}</Text>}

          {/* Color Picker */}
          <Text style={styles.fieldLabel}>{t('tagColor')}</Text>
          <View style={styles.colorGrid}>
            {TAG_COLORS.map((c) => (
              <Pressable
                key={c}
                style={[
                  styles.colorCircle,
                  { backgroundColor: c },
                  color === c && styles.colorCircleSelected,
                ]}
                onPress={() => setColor(c)}
              >
                {color === c && (
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                )}
              </Pressable>
            ))}
          </View>

          {/* Preview */}
          <Text style={styles.fieldLabel}>Preview</Text>
          <View style={styles.preview}>
            <View style={[styles.previewDot, { backgroundColor: color }]} />
            <Text style={styles.previewText}>{name || t('tagNamePlaceholder')}</Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: rt.insets.top,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  closeIcon: {
    color: theme.colors.text,
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.bold,
  },
  saveButton: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  fieldLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.semiBold,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.regular,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  placeholder: {
    color: theme.colors.textMuted,
  },
  error: {
    color: theme.colors.destructive,
    fontSize: theme.fontSize.sm,
    marginTop: 4,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorCircleSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    ...theme.shadows.md,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    gap: 8,
  },
  previewDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  previewText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.medium,
  },
}));
