import { FONT_WEIGHT_MAP } from './fonts';

import type { FontFamily } from '@/types';

export const getFontFamily = (font: FontFamily = 'HindSiliguri') => FONT_WEIGHT_MAP[font];

export const baseTheme = {
  gap: (v: number) => v * 4,
  fontFamily: getFontFamily('HindSiliguri'),
  fontSize: {
    xxs: 8,
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 22,
    '3xl': 24,
    '4xl': 28,
  } as const,
  borderRadius: {
    none: 0,
    xs: 2,
    sm: 4,
    base: 6,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
  } as const,
  borderWidth: {
    none: 0,
    xs: 1,
    sm: 2,
    base: 3,
  } as const,
  shadows: {
    xs: {
      shadowColor: '#0000001A',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.25,
      shadowRadius: 1.0,
      elevation: 1,
    },
    sm: {
      shadowColor: '#0000001A',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4.59,
      elevation: 2,
    },
    md: {
      shadowColor: '#0000001A',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: '#0000001A',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 6,
    },
    xl: {
      shadowColor: '#0000001A',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 8,
    },
    '2xl': {
      shadowColor: '#0000001A',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 10,
    },
  } as const,
};
