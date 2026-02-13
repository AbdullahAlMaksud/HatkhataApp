import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Tag } from '@/types';

const DEFAULT_TAGS: Tag[] = [
  { id: 'tag-grocery', name: 'Grocery', color: '#34C759' },
  { id: 'tag-bazaar', name: 'Bazaar', color: '#3B82F6' },
  { id: 'tag-essentials', name: 'Essentials', color: '#F59E0B' },
  { id: 'tag-vegetables', name: 'Vegetables', color: '#14B8A6' },
  { id: 'tag-fruits', name: 'Fruits', color: '#EC4899' },
  { id: 'tag-fish', name: 'Fish', color: '#8B5CF6' },
  { id: 'tag-meat', name: 'Meat', color: '#EF4444' },
];

interface TagState {
  tags: Tag[];
  addTag: (name: string, color: string) => string | null;
  updateTag: (id: string, updates: Partial<Omit<Tag, 'id'>>) => boolean;
  deleteTag: (id: string) => void;
  getTagById: (id: string) => Tag | undefined;
  isDuplicateName: (name: string, excludeId?: string) => boolean;
}

export const useTagStore = create<TagState>()(
  persist(
    (set, get) => ({
      tags: DEFAULT_TAGS,

      addTag: (name, color) => {
        if (get().isDuplicateName(name)) return null;
        const id = `tag-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const newTag: Tag = { id, name, color };
        set((state) => ({ tags: [...state.tags, newTag] }));
        return id;
      },

      updateTag: (id, updates) => {
        if (updates.name && get().isDuplicateName(updates.name, id)) return false;
        set((state) => ({
          tags: state.tags.map((tag) =>
            tag.id === id ? { ...tag, ...updates } : tag,
          ),
        }));
        return true;
      },

      deleteTag: (id) => {
        set((state) => ({
          tags: state.tags.filter((tag) => tag.id !== id),
        }));
      },

      getTagById: (id) => {
        return get().tags.find((tag) => tag.id === id);
      },

      isDuplicateName: (name, excludeId) => {
        return get().tags.some(
          (tag) =>
            tag.name.toLowerCase() === name.toLowerCase() && tag.id !== excludeId,
        );
      },
    }),
    {
      name: 'bazaar-tags',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
