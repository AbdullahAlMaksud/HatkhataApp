import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface ListTitleSectionProps {
  title: string;
  date: string;
  isEditing?: boolean;
  onChangeTitle?: (text: string) => void;
}

export const ListTitleSection: React.FC<ListTitleSectionProps> = ({
  title,
  date,
  isEditing = false,
  onChangeTitle,
}) => {
  return (
    <View style={styles.container}>
      {isEditing ? (
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={onChangeTitle}
          placeholder="List Title"
          multiline
        />
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}
      <Text style={styles.date}>{date}</Text>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: theme.fontSize.xl, // Larger than before
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  titleInput: {
    fontSize: theme.fontSize.xl,
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    padding: 0,
  },
  date: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    fontFamily: theme.fontFamily.regular,
  },
}));
