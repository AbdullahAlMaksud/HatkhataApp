/* eslint-disable import/no-named-as-default-member */
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { resources } from './resources';

i18next.use(initReactI18next).init({
  resources,
  lng: 'bn', // Default language: Bangla
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export type Language = keyof typeof resources;

export const changeLanguage = async (lang: Language) => {
  await i18next.changeLanguage(lang);
};

export default i18next;
