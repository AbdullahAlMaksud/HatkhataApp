import AsyncStorage from '@react-native-async-storage/async-storage';
import SQLiteStorage from 'expo-sqlite/kv-store';
import type { StateStorage } from 'zustand/middleware';

export const sqliteStateStorage: StateStorage = {
  getItem: async (name) => {
    const sqliteValue = await SQLiteStorage.getItem(name);
    if (sqliteValue != null) {
      return sqliteValue;
    }

    const legacyValue = await AsyncStorage.getItem(name);
    if (legacyValue != null) {
      await SQLiteStorage.setItem(name, legacyValue);
      await AsyncStorage.removeItem(name);
    }

    return legacyValue;
  },

  setItem: (name, value) => SQLiteStorage.setItem(name, value),

  removeItem: async (name) => {
    await SQLiteStorage.removeItem(name);
    await AsyncStorage.removeItem(name);
  },
};
