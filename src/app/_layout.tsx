import '@/i18n';

import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useUserStore } from '@/store';
import { FONT_ASSETS } from '@/styles/theme/fonts';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const isOnboarded = useUserStore((s) => s.isOnboarded);

  const [fontsLoaded] = useFonts(FONT_ASSETS);

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="main" />
        <Stack.Screen
          name="list/[id]"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="profile"
          options={{ animation: 'slide_from_right' }}
        />
      </Stack>
      <StatusBar style='dark'/>
      {!isOnboarded && <Redirect href="/onboarding" />}
    </GestureHandlerRootView>
  );
};

export default RootLayout;
