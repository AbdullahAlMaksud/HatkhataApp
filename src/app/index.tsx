import { Redirect } from 'expo-router';

import { useUserStore } from '@/store';

const Index = () => {
  const isOnboarded = useUserStore((s) => s.isOnboarded);

  if (!isOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/main" />;
};

export default Index;
