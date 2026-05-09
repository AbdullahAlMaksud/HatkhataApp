import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  normalizeBazaarItem,
  normalizeBazaarList,
  normalizeLists,
} from './normalizers';
import { sqliteStateStorage } from './persist-storage';
import type { BazaarItem, BazaarList, Unit } from '@/types';
import { createEntityId } from '@/utils/id';

interface ListState {
  lists: BazaarList[];
  addList: (
    title: string,
    tagId?: string,
    isUrgent?: boolean,
    items?: { name: string; quantity: string; price: number }[],
  ) => string;
  updateList: (id: string, updates: Partial<Omit<BazaarList, 'id'>>) => void;
  deleteList: (id: string) => void;
  reorderLists: (lists: BazaarList[]) => void;
  togglePin: (id: string) => void;

  // Item actions
  addItem: (
    listId: string,
    name: string,
    tagId?: string,
    quantity?: string,
    unit?: Unit,
    price?: number,
  ) => void;
  updateItem: (listId: string, itemId: string, updates: Partial<Omit<BazaarItem, 'id'>>) => void;
  deleteItem: (listId: string, itemId: string) => void;
  toggleItemCheck: (listId: string, itemId: string) => void;
  reorderItems: (listId: string, items: BazaarItem[]) => void;
  clearCheckedItems: (listId: string) => void;
  replaceAllLists: (lists: BazaarList[]) => void;
  removeTagReferences: (tagId: string) => void;

  // Selectors
  getListById: (id: string) => BazaarList | undefined;
  getSortedLists: () => BazaarList[];
  getListsByTag: (tagId: string | null) => BazaarList[];
}

interface PersistedListState {
  lists?: BazaarList[];
}

export const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      lists: [],

      addList: (title, tagId, isUrgent = false, items = []) => {
        const id = createEntityId('list');
        const now = new Date().toISOString();
        const initialItems: BazaarItem[] = items.map((item, index) => ({
          ...normalizeBazaarItem(
            {
              id: createEntityId('item'),
              name: item.name,
              quantity: item.quantity || '',
              price: item.price || 0,
              isChecked: false,
              order: index,
              createdAt: now,
              updatedAt: now,
              syncStatus: 'pending',
            },
            index,
          ),
        }));
        const newList = normalizeBazaarList(
          {
            id,
            title,
            tagId,
            isUrgent,
            isPinned: false,
            isNotePinned: false,
            items: initialItems,
            createdAt: now,
            updatedAt: now,
            order: get().lists.length,
            syncStatus: 'pending',
          },
          get().lists.length,
        );
        set((state) => ({ lists: [...state.lists, newList] }));
        return id;
      },

      updateList: (id, updates) => {
        const now = new Date().toISOString();
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === id
              ? normalizeBazaarList(
                  {
                    ...list,
                    ...updates,
                    updatedAt: now,
                    syncStatus: 'pending',
                    lastSyncedAt: undefined,
                  },
                  list.order,
                )
              : list,
          ),
        }));
      },

      deleteList: (id) => {
        const now = new Date().toISOString();
        set((state) => ({
          lists: state.lists
            .filter((list) => list.id !== id)
            .map((list, index) =>
              normalizeBazaarList(
                {
                  ...list,
                  order: index,
                  updatedAt: now,
                  syncStatus: 'pending',
                  lastSyncedAt: undefined,
                },
                index,
              ),
            ),
        }));
      },

      reorderLists: (lists) => {
        set({
          lists: lists.map((list, index) =>
            normalizeBazaarList(
              {
                ...list,
                order: index,
                updatedAt: new Date().toISOString(),
                syncStatus: 'pending',
                lastSyncedAt: undefined,
              },
              index,
            ),
          ),
        });
      },

      togglePin: (id) => {
        const now = new Date().toISOString();
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === id
              ? normalizeBazaarList(
                  {
                    ...list,
                    isPinned: !list.isPinned,
                    updatedAt: now,
                    syncStatus: 'pending',
                    lastSyncedAt: undefined,
                  },
                  list.order,
                )
              : list,
          ),
        }));
      },

      addItem: (listId, name, tagId, quantity = '', unit, price = 0) => {
        const now = new Date().toISOString();
        set((state) => ({
          lists: state.lists.map((list) => {
            if (list.id !== listId) return list;
            const newItem = normalizeBazaarItem(
              {
                id: createEntityId('item'),
                name,
                tagId,
                quantity,
                unit,
                price,
                isChecked: false,
                order: list.items.length,
                createdAt: now,
                updatedAt: now,
                syncStatus: 'pending',
              },
              list.items.length,
            );
            return {
              ...list,
              items: [...list.items, newItem],
              updatedAt: now,
              syncStatus: 'pending',
              lastSyncedAt: undefined,
            };
          }),
        }));
      },

      updateItem: (listId, itemId, updates) => {
        const now = new Date().toISOString();
        set((state) => ({
          lists: state.lists.map((list) => {
            if (list.id !== listId) return list;
            return {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId
                  ? normalizeBazaarItem(
                      {
                        ...item,
                        ...updates,
                        updatedAt: now,
                        syncStatus: 'pending',
                        lastSyncedAt: undefined,
                      },
                      item.order,
                    )
                  : item,
              ),
              updatedAt: now,
              syncStatus: 'pending',
              lastSyncedAt: undefined,
            };
          }),
        }));
      },

      deleteItem: (listId, itemId) => {
        const now = new Date().toISOString();
        set((state) => ({
          lists: state.lists.map((list) => {
            if (list.id !== listId) return list;
            return {
              ...list,
              items: list.items
                .filter((item) => item.id !== itemId)
                .map((item, index) =>
                  normalizeBazaarItem(
                    {
                      ...item,
                      order: index,
                      updatedAt: now,
                      syncStatus: 'pending',
                      lastSyncedAt: undefined,
                    },
                    index,
                  ),
                ),
              updatedAt: now,
              syncStatus: 'pending',
              lastSyncedAt: undefined,
            };
          }),
        }));
      },

      toggleItemCheck: (listId, itemId) => {
        const now = new Date().toISOString();
        set((state) => ({
          lists: state.lists.map((list) => {
            if (list.id !== listId) return list;
            return {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId
                  ? normalizeBazaarItem(
                      {
                        ...item,
                        isChecked: !item.isChecked,
                        updatedAt: now,
                        syncStatus: 'pending',
                        lastSyncedAt: undefined,
                      },
                      item.order,
                    )
                  : item,
              ),
              updatedAt: now,
              syncStatus: 'pending',
              lastSyncedAt: undefined,
            };
          }),
        }));
      },

      reorderItems: (listId, items) => {
        const now = new Date().toISOString();
        set((state) => ({
          lists: state.lists.map((list) => {
            if (list.id !== listId) return list;
            return {
              ...list,
              items: items.map((item, index) =>
                normalizeBazaarItem(
                  {
                    ...item,
                    order: index,
                    updatedAt: now,
                    syncStatus: 'pending',
                    lastSyncedAt: undefined,
                  },
                  index,
                ),
              ),
              updatedAt: now,
              syncStatus: 'pending',
              lastSyncedAt: undefined,
            };
          }),
        }));
      },

      clearCheckedItems: (listId) => {
        const now = new Date().toISOString();
        set((state) => ({
          lists: state.lists.map((list) => {
            if (list.id !== listId) return list;
            return {
              ...list,
              items: list.items
                .filter((item) => !item.isChecked)
                .map((item, index) =>
                  normalizeBazaarItem(
                    {
                      ...item,
                      order: index,
                      updatedAt: now,
                      syncStatus: 'pending',
                      lastSyncedAt: undefined,
                    },
                    index,
                  ),
                ),
              updatedAt: now,
              syncStatus: 'pending',
              lastSyncedAt: undefined,
            };
          }),
        }));
      },

      replaceAllLists: (lists) => {
        set({ lists: normalizeLists(lists) });
      },

      removeTagReferences: (tagId) => {
        const now = new Date().toISOString();
        set((state) => ({
          lists: state.lists.map((list) => {
            const hasListTag = list.tagId === tagId;
            const hasItemTag = list.items.some((item) => item.tagId === tagId);

            if (!hasListTag && !hasItemTag) {
              return list;
            }

            return normalizeBazaarList(
              {
                ...list,
                tagId: hasListTag ? undefined : list.tagId,
                items: list.items.map((item, index) =>
                  item.tagId === tagId
                    ? normalizeBazaarItem(
                        {
                          ...item,
                          tagId: undefined,
                          updatedAt: now,
                          syncStatus: 'pending',
                          lastSyncedAt: undefined,
                        },
                        index,
                      )
                    : item,
                ),
                updatedAt: now,
                syncStatus: 'pending',
                lastSyncedAt: undefined,
              },
              list.order,
            );
          }),
        }));
      },

      getListById: (id) => {
        return get().lists.find((list) => list.id === id);
      },

      getSortedLists: () => {
        const { lists } = get();
        const pinned = lists.filter((l) => l.isPinned).sort((a, b) => a.order - b.order);
        const unpinned = lists.filter((l) => !l.isPinned).sort((a, b) => a.order - b.order);
        return [...pinned, ...unpinned];
      },

      getListsByTag: (tagId) => {
        const sorted = get().getSortedLists();
        if (!tagId) return sorted;
        return sorted.filter((list) => list.tagId === tagId);
      },
    }),
    {
      name: 'bazaar-lists',
      version: 2,
      storage: createJSONStorage(() => sqliteStateStorage),
      partialize: (state) => ({ lists: state.lists }),
      migrate: (persistedState) => ({
        lists: normalizeLists((persistedState as PersistedListState | undefined)?.lists),
      }),
    },
  ),
);
