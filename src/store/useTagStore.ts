import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { normalizeTag, normalizeTags, createDefaultTags } from './normalizers';
import { sqliteStateStorage } from './persist-storage';
import type { Tag } from '@/types';
import { createEntityId } from '@/utils/id';

interface TagState {
  tags: Tag[];
  addTag: (name: string, color: string) => string | null;
  updateTag: (id: string, updates: Partial<Omit<Tag, 'id'>>) => boolean;
  deleteTag: (id: string) => void;
  replaceAllTags: (tags: Tag[]) => void;
  getTagById: (id: string) => Tag | undefined;
  isDuplicateName: (name: string, excludeId?: string) => boolean;
}

interface PersistedTagState {
  tags?: Tag[];
}

export const useTagStore = create<TagState>()(
  persist(
    (set, get) => ({
      tags: createDefaultTags(),

      addTag: (name, color) => {
        if (get().isDuplicateName(name)) return null;
        const now = new Date().toISOString();
        const id = createEntityId('tag');
        const newTag = normalizeTag(
          {
            id,
            name,
            color,
            createdAt: now,
            updatedAt: now,
            syncStatus: 'pending',
          },
          get().tags.length,
        );
        set((state) => ({ tags: [...state.tags, newTag] }));
        return id;
      },

      updateTag: (id, updates) => {
        if (updates.name && get().isDuplicateName(updates.name, id)) return false;
        const now = new Date().toISOString();
        set((state) => ({
          tags: state.tags.map((tag) =>
            tag.id === id
              ? normalizeTag(
                  {
                    ...tag,
                    ...updates,
                    updatedAt: now,
                    syncStatus: 'pending',
                    lastSyncedAt: undefined,
                  },
                  state.tags.findIndex((item) => item.id === id),
                )
              : tag,
          ),
        }));
        return true;
      },

      deleteTag: (id) => {
        set((state) => ({
          tags: state.tags.filter((tag) => tag.id !== id),
        }));
      },

      replaceAllTags: (tags) => {
        set({ tags: normalizeTags(tags, false) });
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
      version: 2,
      storage: createJSONStorage(() => sqliteStateStorage),
      partialize: (state) => ({ tags: state.tags }),
      migrate: (persistedState) => ({
        tags: normalizeTags((persistedState as PersistedTagState | undefined)?.tags),
      }),
    },
  ),
);
