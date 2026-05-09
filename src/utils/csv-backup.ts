import {
  normalizeBazaarItem,
  normalizeBazaarList,
  normalizeTag,
} from '@/store/normalizers';
import type { BazaarList, Tag, SyncStatus, Unit } from '@/types';

const BACKUP_VERSION = '2';

const BACKUP_HEADERS = [
  'backup_version',
  'row_type',
  'tag_id',
  'tag_name',
  'tag_color',
  'tag_created_at',
  'tag_updated_at',
  'tag_sync_status',
  'tag_last_synced_at',
  'list_id',
  'list_title',
  'list_tag_id',
  'list_is_urgent',
  'list_is_pinned',
  'list_notes',
  'list_created_at',
  'list_updated_at',
  'list_order',
  'list_sync_status',
  'list_last_synced_at',
  'item_id',
  'item_name',
  'item_tag_id',
  'item_quantity',
  'item_unit',
  'item_price',
  'item_is_checked',
  'item_order',
  'item_created_at',
  'item_updated_at',
  'item_sync_status',
  'item_last_synced_at',
] as const;

type BackupHeader = (typeof BACKUP_HEADERS)[number];
type BackupRowRecord = Record<BackupHeader, string>;

interface BackupBuildInput {
  lists: BazaarList[];
  tags: Tag[];
}

export interface ParsedBackup {
  lists: BazaarList[];
  tags: Tag[];
  hasExplicitTags: boolean;
  summary: {
    listCount: number;
    itemCount: number;
    tagCount: number;
  };
}

const escapeCsvValue = (value: string | number | boolean | undefined): string => {
  const normalized = String(value ?? '').replace(/"/g, '""');
  return `"${normalized}"`;
};

const serializeCsvRow = (
  values: readonly (string | number | boolean | undefined)[],
): string =>
  values.map(escapeCsvValue).join(',');

const parseCsv = (input: string): string[][] => {
  const rows: string[][] = [];
  const normalized = input.replace(/^\uFEFF/, '');
  let currentRow: string[] = [];
  let currentValue = '';
  let inQuotes = false;

  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index];

    if (inQuotes) {
      if (char === '"') {
        if (normalized[index + 1] === '"') {
          currentValue += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        currentValue += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ',') {
      currentRow.push(currentValue);
      currentValue = '';
      continue;
    }

    if (char === '\n') {
      currentRow.push(currentValue);
      if (!(currentRow.length === 1 && currentRow[0] === '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentValue = '';
      continue;
    }

    if (char !== '\r') {
      currentValue += char;
    }
  }

  currentRow.push(currentValue);
  if (!(currentRow.length === 1 && currentRow[0] === '')) {
    rows.push(currentRow);
  }

  return rows;
};

const toNumber = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (!value) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'completed'].includes(normalized)) {
    return true;
  }
  if (['0', 'false', 'no', 'pending'].includes(normalized)) {
    return false;
  }

  return fallback;
};

const toOptionalString = (value: string | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const toSyncStatus = (value: string | undefined): SyncStatus | undefined => {
  if (value === 'pending' || value === 'synced' || value === 'failed') {
    return value;
  }

  return undefined;
};

const toDateOrNow = (value: string | undefined): string => {
  if (value) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return new Date().toISOString();
};

const toRecord = (header: string[], row: string[]): Record<string, string> =>
  header.reduce<Record<string, string>>((acc, column, index) => {
    acc[column] = row[index] ?? '';
    return acc;
  }, {});

const isBackupHeader = (header: string[]): header is BackupHeader[] =>
  BACKUP_HEADERS.every((column) => header.includes(column));

const buildBackupRowRecord = (): BackupRowRecord => ({
  backup_version: BACKUP_VERSION,
  row_type: '',
  tag_id: '',
  tag_name: '',
  tag_color: '',
  tag_created_at: '',
  tag_updated_at: '',
  tag_sync_status: '',
  tag_last_synced_at: '',
  list_id: '',
  list_title: '',
  list_tag_id: '',
  list_is_urgent: '',
  list_is_pinned: '',
  list_notes: '',
  list_created_at: '',
  list_updated_at: '',
  list_order: '',
  list_sync_status: '',
  list_last_synced_at: '',
  item_id: '',
  item_name: '',
  item_tag_id: '',
  item_quantity: '',
  item_unit: '',
  item_price: '',
  item_is_checked: '',
  item_order: '',
  item_created_at: '',
  item_updated_at: '',
  item_sync_status: '',
  item_last_synced_at: '',
});

const serializeBackupRecord = (record: BackupRowRecord): string =>
  serializeCsvRow(BACKUP_HEADERS.map((column) => record[column]));

const createTagRecord = (tag: Tag): BackupRowRecord => ({
  ...buildBackupRowRecord(),
  row_type: 'tag',
  tag_id: tag.id,
  tag_name: tag.name,
  tag_color: tag.color,
  tag_created_at: tag.createdAt,
  tag_updated_at: tag.updatedAt,
  tag_sync_status: tag.syncStatus,
  tag_last_synced_at: tag.lastSyncedAt ?? '',
});

const createListRecord = (list: BazaarList): BackupRowRecord => ({
  ...buildBackupRowRecord(),
  row_type: 'list',
  list_id: list.id,
  list_title: list.title,
  list_tag_id: list.tagId ?? '',
  list_is_urgent: String(list.isUrgent),
  list_is_pinned: String(list.isPinned),
  list_notes: list.notes ?? '',
  list_created_at: list.createdAt,
  list_updated_at: list.updatedAt,
  list_order: String(list.order),
  list_sync_status: list.syncStatus,
  list_last_synced_at: list.lastSyncedAt ?? '',
});

const createItemRecord = (list: BazaarList, item: BazaarList['items'][number]): BackupRowRecord => ({
  ...buildBackupRowRecord(),
  row_type: 'item',
  list_id: list.id,
  list_title: list.title,
  list_tag_id: list.tagId ?? '',
  list_is_urgent: String(list.isUrgent),
  list_is_pinned: String(list.isPinned),
  list_notes: list.notes ?? '',
  list_created_at: list.createdAt,
  list_updated_at: list.updatedAt,
  list_order: String(list.order),
  list_sync_status: list.syncStatus,
  list_last_synced_at: list.lastSyncedAt ?? '',
  item_id: item.id,
  item_name: item.name,
  item_tag_id: item.tagId ?? '',
  item_quantity: item.quantity,
  item_unit: item.unit ?? '',
  item_price: String(item.price),
  item_is_checked: String(item.isChecked),
  item_order: String(item.order),
  item_created_at: item.createdAt,
  item_updated_at: item.updatedAt,
  item_sync_status: item.syncStatus,
  item_last_synced_at: item.lastSyncedAt ?? '',
});

export const buildBackupCsv = ({ lists, tags }: BackupBuildInput): string => {
  const rows = [
    serializeCsvRow(BACKUP_HEADERS),
    ...tags.map((tag) => serializeBackupRecord(createTagRecord(tag))),
    ...lists.flatMap((list) => {
      const serializedRows = [serializeBackupRecord(createListRecord(list))];

      return serializedRows.concat(
        list.items.map((item) => serializeBackupRecord(createItemRecord(list, item))),
      );
    }),
  ];

  return rows.join('\n');
};

const parseCurrentBackup = (header: string[], rows: string[][]): ParsedBackup => {
  const tagsById = new Map<string, Tag>();
  const listsById = new Map<string, Partial<BazaarList>>();
  let sawTagRows = false;

  const ensureList = (record: Record<string, string>, fallbackIndex: number) => {
    const listId = toOptionalString(record.list_id);
    if (!listId) {
      return undefined;
    }

    const existing = listsById.get(listId);
    const listTagId = toOptionalString(record.list_tag_id);
    const nextList: Partial<BazaarList> = {
      ...existing,
      id: listId,
      title: toOptionalString(record.list_title) ?? existing?.title ?? 'Imported list',
      tagId: listTagId ?? existing?.tagId,
      isUrgent: toBoolean(record.list_is_urgent, existing?.isUrgent ?? false),
      isPinned: toBoolean(record.list_is_pinned, existing?.isPinned ?? false),
      notes: toOptionalString(record.list_notes) ?? existing?.notes,
      createdAt: toOptionalString(record.list_created_at) ?? existing?.createdAt,
      updatedAt: toOptionalString(record.list_updated_at) ?? existing?.updatedAt,
      order: toNumber(record.list_order, existing?.order ?? fallbackIndex),
      syncStatus: toSyncStatus(record.list_sync_status) ?? existing?.syncStatus,
      lastSyncedAt:
        toOptionalString(record.list_last_synced_at) ?? existing?.lastSyncedAt,
      items: existing?.items ?? [],
      isNotePinned: existing?.isNotePinned ?? false,
    };

    listsById.set(listId, nextList);
    return nextList;
  };

  rows.forEach((row, index) => {
    const rawRecord = toRecord(header, row);
    const record = buildBackupRowRecord();
    BACKUP_HEADERS.forEach((column) => {
      record[column] = rawRecord[column] ?? '';
    });

    if (record.row_type === 'tag') {
      sawTagRows = true;
      if (!record.tag_id) {
        return;
      }

      tagsById.set(
        record.tag_id,
        normalizeTag(
          {
            id: record.tag_id,
            name: record.tag_name,
            color: record.tag_color,
            createdAt: record.tag_created_at,
            updatedAt: record.tag_updated_at,
            syncStatus: toSyncStatus(record.tag_sync_status),
            lastSyncedAt: record.tag_last_synced_at,
          },
          tagsById.size,
        ),
      );
      return;
    }

    const currentList = ensureList(record, index);
    if (!currentList) {
      return;
    }

    if (record.row_type !== 'item' || !record.item_id || !record.item_name) {
      return;
    }

    const nextItem = normalizeBazaarItem(
      {
        id: record.item_id,
        name: record.item_name,
        tagId: toOptionalString(record.item_tag_id),
        quantity: record.item_quantity,
        unit: toOptionalString(record.item_unit) as Unit | undefined,
        price: toNumber(record.item_price, 0),
        isChecked: toBoolean(record.item_is_checked, false),
        order: toNumber(record.item_order, currentList.items?.length ?? 0),
        createdAt: record.item_created_at,
        updatedAt: record.item_updated_at,
        syncStatus: toSyncStatus(record.item_sync_status),
        lastSyncedAt: record.item_last_synced_at,
      },
      currentList.items?.length ?? 0,
    );

    currentList.items = [...(currentList.items ?? []), nextItem];
    listsById.set(currentList.id!, currentList);
  });

  const tags = Array.from(tagsById.values());
  const tagIds = new Set(tags.map((tag) => tag.id));
  const lists = Array.from(listsById.values()).map((list, index) =>
    normalizeBazaarList(
      {
        ...list,
        tagId: list.tagId && tagIds.has(list.tagId) ? list.tagId : undefined,
        items: (list.items ?? []).map((item) => ({
          ...item,
          tagId: item.tagId && tagIds.has(item.tagId) ? item.tagId : undefined,
        })),
      },
      index,
    ),
  );

  return {
    lists,
    tags,
    hasExplicitTags: sawTagRows,
    summary: {
      listCount: lists.length,
      itemCount: lists.reduce((total, list) => total + list.items.length, 0),
      tagCount: tags.length,
    },
  };
};

const parseLegacyBackup = (header: string[], rows: string[][]): ParsedBackup => {
  const headerIndex = Object.fromEntries(
    header.map((column, index) => [column.trim().toLowerCase(), index]),
  );
  const groupedLists = new Map<string, Partial<BazaarList>>();

  rows.forEach((row, index) => {
    const title = row[headerIndex['list title']]?.trim();
    const itemName = row[headerIndex['item name']]?.trim();
    if (!title || !itemName) {
      return;
    }

    const date = row[headerIndex['date']]?.trim();
    const notes = row[headerIndex['notes']]?.trim();
    const key = `${date ?? ''}::${title}::${notes ?? ''}`;
    const existing = groupedLists.get(key);
    const createdAt = toDateOrNow(date);

    const list: Partial<BazaarList> = existing ?? {
      id: `list-import-${index}`,
      title,
      notes,
      isUrgent: false,
      isPinned: false,
      isNotePinned: false,
      createdAt,
      updatedAt: createdAt,
      order: groupedLists.size,
      syncStatus: 'pending',
      items: [],
    };

    list.items = [
      ...(list.items ?? []),
      normalizeBazaarItem(
        {
          id: `item-import-${index}`,
          name: itemName,
          quantity: row[headerIndex['quantity']]?.trim() ?? '',
          price: toNumber(row[headerIndex['price']], 0),
          isChecked: toBoolean(row[headerIndex['status']], false),
          order: list.items?.length ?? 0,
          createdAt,
          updatedAt: createdAt,
          syncStatus: 'pending',
        },
        list.items?.length ?? 0,
      ),
    ];

    groupedLists.set(key, list);
  });

  const lists = Array.from(groupedLists.values()).map((list, index) =>
    normalizeBazaarList(list, index),
  );

  return {
    lists,
    tags: [],
    hasExplicitTags: false,
    summary: {
      listCount: lists.length,
      itemCount: lists.reduce((total, list) => total + list.items.length, 0),
      tagCount: 0,
    },
  };
};

export const parseBackupCsv = (input: string): ParsedBackup => {
  const rows = parseCsv(input);
  if (rows.length < 2) {
    throw new Error('CSV backup is empty');
  }

  const [header, ...dataRows] = rows;
  if (isBackupHeader(header)) {
    return parseCurrentBackup(header, dataRows);
  }

  const normalizedHeader = header.map((column) => column.trim().toLowerCase());
  const isLegacyBackup =
    normalizedHeader.includes('list title') && normalizedHeader.includes('item name');

  if (isLegacyBackup) {
    return parseLegacyBackup(header, dataRows);
  }

  throw new Error('Unsupported CSV backup format');
};
