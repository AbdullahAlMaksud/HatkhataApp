import { FONT_FAMILIES, FONT_WEIGHT_MAP } from '@/styles/theme/fonts';
import type { FontFamily } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface FontPickerModalProps {
  visible: boolean;
  onClose: () => void;
  currentFont: FontFamily;
  onSelect: (font: FontFamily) => void;
  language: string;
  title: string;
}

const FontPickerModal: FC<FontPickerModalProps> = ({
  visible,
  onClose,
  currentFont,
  onSelect,
  language,
  title,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Pressable onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={24} color={styles.modalClose.color} />
          </Pressable>
        </View>
        <ScrollView style={styles.modalBody}>
          {FONT_FAMILIES.map((font) => {
            const weights = FONT_WEIGHT_MAP[font.key];
            const isSelected = currentFont === font.key;
            return (
              <Pressable
                key={font.key}
                style={[styles.fontOption, isSelected && styles.fontOptionSelected]}
                onPress={() => onSelect(font.key)}
              >
                <View style={styles.fontOptionInfo}>
                  <Text style={[styles.fontOptionLabel, { fontFamily: weights.bold }]}>
                    {font.label}
                  </Text>
                  <Text style={[styles.fontOptionSample, { fontFamily: weights.regular }]}>
                    {language === 'bn'
                      ? 'আজকের বাজারের তালিকা ১২৩'
                      : "Today's bazaar list 123"}
                  </Text>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={24} color={styles.checkIcon.color} />
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: rt.insets.top,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  modalTitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.bold,
  },
  modalClose: {
    color: theme.colors.text,
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  fontOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  fontOptionSelected: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: theme.colors.primary + '08',
  },
  fontOptionInfo: {
    flex: 1,
  },
  fontOptionLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.bold,
    marginBottom: 4,
  },
  fontOptionSample: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  checkIcon: {
    color: theme.colors.primary,
  },
}));

export default FontPickerModal;
