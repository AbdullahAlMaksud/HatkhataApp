export type Unit = 'kg' | 'g' | 'pcs' | 'litre' | 'ml' | 'dozen' | 'hali' | 'bag';

export type ThemeMode = 'light' | 'dark' | 'system';

export type FontFamily = 'HindSiliguri' | 'AnekBangla' | 'NotoSerifBengali' | 'July';

export type SyncStatus = 'pending' | 'synced' | 'failed';

export interface SyncableEntity {
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
  lastSyncedAt?: string;
}

export interface BazaarItem extends SyncableEntity {
  id: string;
  name: string;
  tagId?: string;
  quantity: string;
  unit?: Unit;
  price: number;
  isChecked: boolean;
  order: number;
}

export interface BazaarList extends SyncableEntity {
  id: string;
  title: string;
  tagId?: string;
  isUrgent: boolean;
  isPinned: boolean;
  notes?: string;
  isNotePinned: boolean;
  items: BazaarItem[];
  order: number;
}

export interface Tag extends SyncableEntity {
  id: string;
  name: string;
  color: string;
}

export interface Settings {
  themeMode: ThemeMode;
  language: 'bn' | 'en';
  fontFamily: FontFamily;
  currency: string;
  currencySymbol: string;
  showTotalPrice: boolean;
  moveCompletedToBottom: boolean;
  hapticFeedback: boolean;
}

export interface UserProfile {
  name: string;
  username?: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
}
