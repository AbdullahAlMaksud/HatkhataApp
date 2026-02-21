import { Ionicons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <View style={styles.container} onStartShouldSetResponder={() => true}>
          {/* Icon */}
          <View
            style={[
              styles.iconCircle,
              variant === 'destructive' && styles.iconCircleDestructive,
            ]}>
            <Ionicons
              name={
                variant === 'destructive'
                  ? 'trash-outline'
                  : 'alert-circle-outline'
              }
              size={28}
              color={
                variant === 'destructive'
                  ? styles.iconDestructive.color
                  : styles.iconDefault.color
              }
            />
          </View>

          {/* Content */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={onCancel}>
              <Text style={styles.cancelText}>{cancelText}</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.confirmButton,
                variant === 'destructive' && styles.confirmButtonDestructive,
                pressed && styles.buttonPressed,
              ]}
              onPress={onConfirm}>
              <Text
                style={[
                  styles.confirmText,
                  variant === 'destructive' && styles.confirmTextDestructive,
                ]}>
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create(theme => ({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  container: {
    width: '100%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: 24,
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircleDestructive: {
    backgroundColor: theme.colors.urgentLight,
  },
  iconDefault: {
    color: theme.colors.primary,
  },
  iconDestructive: {
    color: theme.colors.destructive,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  cancelButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelText: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.text,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
  },
  confirmButtonDestructive: {
    backgroundColor: theme.colors.destructive,
  },
  confirmText: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.textInverse,
  },
  confirmTextDestructive: {
    color: theme.colors.textInverse,
  },
}));

export default ConfirmModal;
