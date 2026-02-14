import type { BazaarItem } from '@/types';

export const calculateItemTotal = (price: number): number => {
  return Math.round(price * 100) / 100;
};

export const calculateListTotal = (items: BazaarItem[]): number => {
  return items.reduce(
    (sum, item) => sum + calculateItemTotal(item.price),
    0,
  );
};

export const calculateUncheckedTotal = (items: BazaarItem[]): number => {
  return items
    .filter((item) => !item.isChecked)
    .reduce(
      (sum, item) => sum + calculateItemTotal(item.price),
      0,
    );
};

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export const toBengaliDigits = (str: string): string => {
  return str.replace(/[0-9]/g, (d) => BENGALI_DIGITS[Number(d)]);
};

export const toLocalizedDigits = (value: string | number, language: string): string => {
  const str = String(value);
  return language === 'bn' ? toBengaliDigits(str) : str;
};

export const formatCurrency = (amount: number, symbol: string = '৳', language?: string): string => {
  const formatted = `${symbol} ${(amount ?? 0).toLocaleString()}`;
  return language === 'bn' ? toBengaliDigits(formatted) : formatted;
};

export const getCheckedItems = (items: BazaarItem[]): BazaarItem[] => {
  return items.filter((item) => item.isChecked);
};

export const getUncheckedItems = (items: BazaarItem[]): BazaarItem[] => {
  return items.filter((item) => !item.isChecked);
};

export const sortItemsByOrder = (items: BazaarItem[], moveCompletedToBottom: boolean): BazaarItem[] => {
  if (!moveCompletedToBottom) {
    return [...items].sort((a, b) => a.order - b.order);
  }

  const unchecked = items.filter((i) => !i.isChecked).sort((a, b) => a.order - b.order);
  const checked = items.filter((i) => i.isChecked).sort((a, b) => a.order - b.order);
  return [...unchecked, ...checked];
};
