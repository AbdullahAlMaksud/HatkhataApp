import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { sqliteStateStorage } from './persist-storage';
import type { UserProfile } from '@/types';

interface UserState {
  profile: UserProfile;
  isOnboarded: boolean;
  hasHydrated: boolean;
  setProfile: (profile: Partial<UserProfile>) => void;
  completeOnboarding: (name: string) => void;
  signOut: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: {
        name: '',
      },
      isOnboarded: false,
      hasHydrated: false,

      setProfile: (updates) => {
        set((state) => ({
          profile: { ...state.profile, ...updates },
        }));
      },

      completeOnboarding: (name) => {
        set({
          isOnboarded: true,
          profile: { name },
        });
      },

      signOut: () => {
        set({
          isOnboarded: false,
          profile: { name: '' },
        });
      },

      setHasHydrated: (value) => {
        set({ hasHydrated: value });
      },
    }),
    {
      name: 'bazaar-user',
      storage: createJSONStorage(() => sqliteStateStorage),
      partialize: (state) => ({
        profile: state.profile,
        isOnboarded: state.isOnboarded,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

useUserStore.persist.onFinishHydration(() => {
  useUserStore.setState({ hasHydrated: true });
});
