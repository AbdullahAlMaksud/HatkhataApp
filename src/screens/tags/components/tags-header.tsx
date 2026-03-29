import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface TagsHeaderProps {
  title: string;
}

const TagsHeader: FC<TagsHeaderProps> = ({ title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: theme.fontSize['3xl'],
    color: theme.colors.text,
    fontFamily: theme.fontFamily.bold,
    textAlign: 'center',
  },
}));

export default TagsHeader;
