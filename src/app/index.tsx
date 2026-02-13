import { Redirect } from 'expo-router';

import { useUserStore } from '@/store';

export default function Index() {
  const isOnboarded = useUserStore((s) => s.isOnboarded);

  if (!isOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
