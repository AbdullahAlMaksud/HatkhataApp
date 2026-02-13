import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { BazaarItem, BazaarList, Unit } from '@/types';

interface ListState {
  lists: BazaarList[];
  addList: (
    title: string,
    tagId?: string,
    isUrgent?: boolean,
    items?: Array<{ name: string; quantity: string; price: number }>,
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

  // Selectors
  getListById: (id: string) => BazaarList | undefined;
  getSortedLists: () => BazaarList[];
  getListsByTag: (tagId: string | null) => BazaarList[];
}

export const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      lists: [],

      addList: (title, tagId, isUrgent = false, items = []) => {
        const id = `list-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const now = new Date().toISOString();
        const initialItems: BazaarItem[] = items.map((item, index) => ({
          id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}-${index}`,
          name: item.name,
          quantity: item.quantity || '',
          price: item.price || 0,
          isChecked: false,
          order: index,
        }));
        const newList: BazaarList = {
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
        };
        set((state) => ({ lists: [...state.lists, newList] }));
        return id;
      },

      updateList: (id, updates) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === id
              ? { ...list, ...updates, updatedAt: new Date().toISOString() }
              : list,
          ),
        }));
      },

      deleteList: (id) => {
        set((state) => ({
          lists: state.lists
            .filter((list) => list.id !== id)
            .map((list, index) => ({ ...list, order: index })),
        }));
      },

      reorderLists: (lists) => {
        set({
          lists: lists.map((list, index) => ({ ...list, order: index })),
        });
      },

      togglePin: (id) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === id
              ? { ...list, isPinned: !list.isPinned, updatedAt: new Date().toISOString() }
              : list,
          ),
        }));
      },

      addItem: (listId, name, tagId, quantity = '', unit, price = 0) => {
        set((state) => ({
          lists: state.lists.map((list) => {
            if (list.id !== listId) return list;
            const newItem: BazaarItem = {
              id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
              name,
              tagId,
              quantity,
              unit,
              price,
              isChecked: false,
              order: list.items.length,
            };
            return {
              ...list,
              items: [...list.items, newItem],
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      updateItem: (listId, itemId, updates) => {
        set((state) => ({
          lists: state.lists.map((list) => {
            if (list.id !== listId) return list;
            return {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId ? { ...item, ...updates } : item,
              ),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      deleteItem: (listId, itemId) => {
        set((state) => ({
          lists: state.lists.map((list) => {
            if (list.id !== listId) return list;
            return {
              ...list,
              items: list.items
                .filter((item) => item.id !== itemId)
                .map((item, index) => ({ ...item, order: index })),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      toggleItemCheck: (listId, itemId) => {
        set((state) => ({
          lists: state.lists.map((list) => {
            if (list.id !== listId) return list;
            return {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId ? { ...item, isChecked: !item.isChecked } : item,
              ),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      reorderItems: (listId, items) => {
        set((state) => ({
          lists: state.lists.map((list) => {
            if (list.id !== listId) return list;
            return {
              ...list,
              items: items.map((item, index) => ({ ...item, order: index })),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      clearCheckedItems: (listId) => {
        set((state) => ({
          lists: state.lists.map((list) => {
            if (list.id !== listId) return list;
            return {
              ...list,
              items: list.items
                .filter((item) => !item.isChecked)
                .map((item, index) => ({ ...item, order: index })),
              updatedAt: new Date().toISOString(),
            };
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
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
