import { Ionicons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface Currency {
  code: string;
  symbol: string;
  label: string;
  labelEn: string;
}

interface CurrencyPickerModalProps {
  visible: boolean;
  onClose: () => void;
  currentCurrency: string;
  onSelect: (code: string, symbol: string) => void;
  language: string;
  title: string;
  currencies: Currency[];
}

const CurrencyPickerModal: FC<CurrencyPickerModalProps> = ({
  visible,
  onClose,
  currentCurrency,
  onSelect,
  language,
  title,
  currencies,
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
          {currencies.map((cur) => {
            const isSelected = currentCurrency === cur.code;
            return (
              <Pressable
                key={cur.code}
                style={[styles.currencyOption, isSelected && styles.currencyOptionSelected]}
                onPress={() => onSelect(cur.code, cur.symbol)}
              >
                <Text style={styles.currencySymbol}>{cur.symbol}</Text>
                <View style={styles.currencyInfo}>
                  <Text style={styles.currencyLabel}>
                    {language === 'bn' ? cur.label : cur.labelEn}
                  </Text>
                  <Text style={styles.currencyCode}>{cur.code}</Text>
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
    color: theme.colors.text,
    fontFamily: theme.fontFamily.bold,
  },
  modalClose: {
    color: theme.colors.text,
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    gap: 12,
  },
  currencyOptionSelected: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: theme.colors.primary + '08',
  },
  currencySymbol: {
    fontSize: theme.fontSize['2xl'],
    color: theme.colors.primary,
    width: 36,
    textAlign: 'center',
    fontFamily: theme.fontFamily.bold,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.bold,
  },
  currencyCode: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  checkIcon: {
    color: theme.colors.primary,
  },
}));

export default CurrencyPickerModal;
