import commonBn from './locales/bn/common.json';
import homeBn from './locales/bn/home.json';
import listBn from './locales/bn/list.json';
import onboardingBn from './locales/bn/onboarding.json';
import profileBn from './locales/bn/profile.json';
import settingsBn from './locales/bn/settings.json';
import tagsBn from './locales/bn/tags.json';
import commonEn from './locales/en/common.json';
import homeEn from './locales/en/home.json';
import listEn from './locales/en/list.json';
import onboardingEn from './locales/en/onboarding.json';
import profileEn from './locales/en/profile.json';
import settingsEn from './locales/en/settings.json';
import tagsEn from './locales/en/tags.json';

export const resources = {
  en: {
    common: commonEn,
    home: homeEn,
    list: listEn,
    settings: settingsEn,
    tags: tagsEn,
    onboarding: onboardingEn,
    profile: profileEn,
  },
  bn: {
    common: commonBn,
    home: homeBn,
    list: listBn,
    settings: settingsBn,
    tags: tagsBn,
    onboarding: onboardingBn,
    profile: profileBn,
  },
} as const;

export type Resources = typeof resources;
