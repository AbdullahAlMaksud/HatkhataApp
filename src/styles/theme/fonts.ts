export type FontFamily = 'HindSiliguri' | 'AnekBangla' | 'NotoSerifBengali' | 'July';

// Font name to display label mapping
export const FONT_FAMILIES: { key: FontFamily; label: string; labelBn: string }[] = [
  { key: 'HindSiliguri', label: 'Hind Siliguri', labelBn: 'হিন্দ সিলিগুড়ি' },
  { key: 'AnekBangla', label: 'Anek Bangla', labelBn: 'অনেক বাংলা' },
  { key: 'NotoSerifBengali', label: 'Noto Serif Bengali', labelBn: 'নোটো সেরিফ বাংলা' },
  { key: 'July', label: 'July', labelBn: 'জুলাই' },
];

// Font weight map per family
export const FONT_WEIGHT_MAP: Record<FontFamily, {
  regular: string;
  medium: string;
  semiBold: string;
  bold: string;
}> = {
  HindSiliguri: {
    regular: 'HindSiliguri-Regular',
    medium: 'HindSiliguri-Medium',
    semiBold: 'HindSiliguri-SemiBold',
    bold: 'HindSiliguri-Bold',
  },
  AnekBangla: {
    regular: 'AnekBangla-Regular',
    medium: 'AnekBangla-Medium',
    semiBold: 'AnekBangla-SemiBold',
    bold: 'AnekBangla-Bold',
  },
  NotoSerifBengali: {
    regular: 'NotoSerifBengali-Regular',
    medium: 'NotoSerifBengali-Medium',
    semiBold: 'NotoSerifBengali-SemiBold',
    bold: 'NotoSerifBengali-Bold',
  },
  July: {
    regular: 'July-Regular',
    medium: 'July-Regular',
    semiBold: 'July-Bold',
    bold: 'July-Bold',
  },
};

// All fonts to load via expo-font
export const FONT_ASSETS = {
  // Hind Siliguri
  'HindSiliguri-Regular': require('@/assets/fonts/Hind_Siliguri/HindSiliguri-Regular.ttf'),
  'HindSiliguri-Medium': require('@/assets/fonts/Hind_Siliguri/HindSiliguri-Medium.ttf'),
  'HindSiliguri-SemiBold': require('@/assets/fonts/Hind_Siliguri/HindSiliguri-SemiBold.ttf'),
  'HindSiliguri-Bold': require('@/assets/fonts/Hind_Siliguri/HindSiliguri-Bold.ttf'),
  // Anek Bangla
  'AnekBangla-Regular': require('@/assets/fonts/Anek_Bangla/AnekBangla-Regular.ttf'),
  'AnekBangla-Medium': require('@/assets/fonts/Anek_Bangla/AnekBangla-Medium.ttf'),
  'AnekBangla-SemiBold': require('@/assets/fonts/Anek_Bangla/AnekBangla-SemiBold.ttf'),
  'AnekBangla-Bold': require('@/assets/fonts/Anek_Bangla/AnekBangla-Bold.ttf'),
  // Noto Serif Bengali
  'NotoSerifBengali-Regular': require('@/assets/fonts/Noto_Serif_Bengali/NotoSerifBengali-Regular.ttf'),
  'NotoSerifBengali-Medium': require('@/assets/fonts/Noto_Serif_Bengali/NotoSerifBengali-Medium.ttf'),
  'NotoSerifBengali-SemiBold': require('@/assets/fonts/Noto_Serif_Bengali/NotoSerifBengali-SemiBold.ttf'),
  'NotoSerifBengali-Bold': require('@/assets/fonts/Noto_Serif_Bengali/NotoSerifBengali-Bold.ttf'),
  // July
  'July-Regular': require('@/assets/fonts/July/July-Regular.ttf'),
  'July-Bold': require('@/assets/fonts/July/July-Bold.ttf'),
} as const;
