import { Stack } from 'expo-router';
import React from 'react';

const TabsLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="tags"
        options={{ animation: 'fade_from_bottom' }}
      />
      <Stack.Screen
        name="settings"
        options={{ animation: 'fade_from_bottom' }}
      />
    </Stack>
  );
};

export default TabsLayout;
