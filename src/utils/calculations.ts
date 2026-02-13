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

export const formatCurrency = (amount: number, symbol: string = '৳'): string => {
  return `${symbol} ${(amount ?? 0).toLocaleString()}`;
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
