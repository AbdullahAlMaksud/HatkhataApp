import { DEFAULT_TAG_TEMPLATES } from './default-tags';
import { createEntityId } from '@/utils/id';
import type {
  BazaarItem,
  BazaarList,
  SyncStatus,
  Tag,
} from '@/types';

const isSyncStatus = (value: unknown): value is SyncStatus =>
  value === 'pending' || value === 'synced' || value === 'failed';

const toSyncStatus = (value: unknown): SyncStatus =>
  isSyncStatus(value) ? value : 'pending';

const toOptionalString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const toTimestamp = (value: unknown, fallback: string): string => {
  const resolved = toOptionalString(value);
  return resolved ?? fallback;
};

const toNumber = (value: unknown, fallback: number): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

const toBoolean = (value: unknown, fallback: boolean): boolean =>
  typeof value === 'boolean' ? value : fallback;

export const createDefaultTags = (): Tag[] => {
  const now = new Date().toISOString();

  return DEFAULT_TAG_TEMPLATES.map((tag) => ({
    ...tag,
    createdAt: now,
    updatedAt: now,
    syncStatus: 'pending',
  }));
};

export const normalizeBazaarItem = (
  item: Partial<BazaarItem>,
  fallbackOrder: number,
): BazaarItem => {
  const createdAt = toTimestamp(item.createdAt, new Date().toISOString());

  return {
    id: toOptionalString(item.id) ?? createEntityId('item'),
    name: item.name?.trim() ?? '',
    tagId: toOptionalString(item.tagId),
    quantity: typeof item.quantity === 'string' ? item.quantity : '',
    unit: item.unit,
    price: toNumber(item.price, 0),
    isChecked: toBoolean(item.isChecked, false),
    order: toNumber(item.order, fallbackOrder),
    createdAt,
    updatedAt: toTimestamp(item.updatedAt, createdAt),
    syncStatus: toSyncStatus(item.syncStatus),
    lastSyncedAt: toOptionalString(item.lastSyncedAt),
  };
};

export const normalizeBazaarList = (
  list: Partial<BazaarList>,
  fallbackOrder: number,
): BazaarList => {
  const createdAt = toTimestamp(list.createdAt, new Date().toISOString());
  const normalizedItems = Array.isArray(list.items)
    ? list.items.map((item, index) => normalizeBazaarItem(item, index))
    : [];

  return {
    id: toOptionalString(list.id) ?? createEntityId('list'),
    title: list.title?.trim() ?? 'Untitled list',
    tagId: toOptionalString(list.tagId),
    isUrgent: toBoolean(list.isUrgent, false),
    isPinned: toBoolean(list.isPinned, false),
    notes: toOptionalString(list.notes),
    isNotePinned: toBoolean(list.isNotePinned, false),
    items: normalizedItems,
    createdAt,
    updatedAt: toTimestamp(list.updatedAt, createdAt),
    order: toNumber(list.order, fallbackOrder),
    syncStatus: toSyncStatus(list.syncStatus),
    lastSyncedAt: toOptionalString(list.lastSyncedAt),
  };
};

export const normalizeTag = (tag: Partial<Tag>, fallbackIndex: number): Tag => {
  const createdAt = toTimestamp(tag.createdAt, new Date().toISOString());

  return {
    id: toOptionalString(tag.id) ?? createEntityId('tag'),
    name: tag.name?.trim() ?? `Tag ${fallbackIndex + 1}`,
    color: toOptionalString(tag.color) ?? '#3B82F6',
    createdAt,
    updatedAt: toTimestamp(tag.updatedAt, createdAt),
    syncStatus: toSyncStatus(tag.syncStatus),
    lastSyncedAt: toOptionalString(tag.lastSyncedAt),
  };
};

export const normalizeLists = (lists?: Partial<BazaarList>[]): BazaarList[] =>
  (lists ?? []).map((list, index) => normalizeBazaarList(list, index));

export const normalizeTags = (
  tags?: Partial<Tag>[],
  fallbackToDefaults: boolean = true,
): Tag[] => {
  if (!tags || tags.length === 0) {
    return fallbackToDefaults ? createDefaultTags() : [];
  }

  return tags.map((tag, index) => normalizeTag(tag, index));
};
