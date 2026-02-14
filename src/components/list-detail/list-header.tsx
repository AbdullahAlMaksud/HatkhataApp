import { Ionicons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface ListHeaderProps {
  title: string;
  onBack: () => void;
  onDelete: () => void;
}

const ListHeader: FC<ListHeaderProps> = ({
  title,
  onBack,
  onDelete,
}) => {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} hitSlop={8}>
        <Ionicons name="chevron-back" size={24} color={styles.backIcon.color} />
      </Pressable>
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <Pressable onPress={onDelete} hitSlop={8}>
        <Ionicons name="trash-outline" size={22} color={styles.deleteIcon.color} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  backIcon: {
    color: theme.colors.text,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.bold,
  },
  deleteIcon: {
    color: theme.colors.destructive,
  },
}));

export default ListHeader;
