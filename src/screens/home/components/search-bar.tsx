import { Ionicons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

const SearchBar: FC<SearchBarProps> = ({ value, onChangeText, onClear }) => {
  return (
    <View style={styles.searchBar}>
      <Ionicons name="search" size={18} color={styles.searchBarIcon.color} />
      <TextInput
        style={styles.searchInput}
        placeholder="তালিকা খুঁজুন..."
        placeholderTextColor={styles.searchBarIcon.color}
        value={value}
        onChangeText={onChangeText}
        autoFocus
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable onPress={onClear}>
          <Ionicons name="close-circle" size={18} color={styles.searchBarIcon.color} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    gap: 10,
  },
  searchBarIcon: {
    color: theme.colors.textMuted,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.regular,
    padding: 0,
  },
}));

export default SearchBar;
