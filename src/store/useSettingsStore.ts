import i18next, { changeLanguage as changeI18nextLanguage } from 'i18next';
import { UnistylesRuntime } from 'react-native-unistyles';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { sqliteStateStorage } from './persist-storage';
import { getFontFamily } from '@/styles/theme/base-theme';
import type { FontFamily, Settings, ThemeMode } from '@/types';

const changeLanguage = (lang: string) => {
  if (i18next.isInitialized) {
    changeI18nextLanguage(lang);
  }
};

const updateThemeFont = (font: FontFamily) => {
  const fontFamily = getFontFamily(font);
  const updateFn = (currentTheme: Record<string, unknown>) => ({
    ...currentTheme,
    fontFamily,
  });
  try {
    UnistylesRuntime.updateTheme('light', updateFn as never);
    UnistylesRuntime.updateTheme('dark', updateFn as never);
  } catch {
    // Runtime may not be ready yet during hydration
  }
};

interface SettingsState extends Settings {
  setThemeMode: (mode: ThemeMode) => void;
  setLanguage: (lang: 'bn' | 'en') => void;
  setFontFamily: (font: FontFamily) => void;
  setCurrency: (currency: string, symbol: string) => void;
  toggleShowTotalPrice: () => void;
  toggleMoveCompletedToBottom: () => void;
  toggleHapticFeedback: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themeMode: 'light',
      language: 'bn',
      fontFamily: 'HindSiliguri',
      currency: 'BDT',
      currencySymbol: '৳',
      showTotalPrice: true,
      moveCompletedToBottom: true,
      hapticFeedback: false,

      setThemeMode: (mode) => {
        set({ themeMode: mode });
      },

      setLanguage: (lang) => {
        changeLanguage(lang);
        set({ language: lang });
      },

      setFontFamily: (font) => {
        updateThemeFont(font);
        set({ fontFamily: font });
      },

      setCurrency: (currency, symbol) => {
        set({ currency, currencySymbol: symbol });
      },

      toggleShowTotalPrice: () => {
        set((state) => ({ showTotalPrice: !state.showTotalPrice }));
      },

      toggleMoveCompletedToBottom: () => {
        set((state) => ({ moveCompletedToBottom: !state.moveCompletedToBottom }));
      },

      toggleHapticFeedback: () => {
        set((state) => ({ hapticFeedback: !state.hapticFeedback }));
      },
    }),
    {
      name: 'bazaar-settings',
      storage: createJSONStorage(() => sqliteStateStorage),
      partialize: (state) => ({
        themeMode: state.themeMode,
        language: state.language,
        fontFamily: state.fontFamily,
        currency: state.currency,
        currencySymbol: state.currencySymbol,
        showTotalPrice: state.showTotalPrice,
        moveCompletedToBottom: state.moveCompletedToBottom,
        hapticFeedback: state.hapticFeedback,
      }),
    },
  ),
);

// Sync language and font when store rehydrates from storage
useSettingsStore.persist.onFinishHydration((state) => {
  if (state.language) {
    changeLanguage(state.language);
  }
  if (state.fontFamily) {
    updateThemeFont(state.fontFamily);
  }
});
