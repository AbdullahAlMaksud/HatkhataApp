import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { UserProfile } from '@/types';

interface UserState {
  profile: UserProfile;
  isOnboarded: boolean;
  setProfile: (profile: Partial<UserProfile>) => void;
  completeOnboarding: (name: string) => void;
  signOut: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: {
        name: '',
      },
      isOnboarded: false,

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
    }),
    {
      name: 'bazaar-user',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
