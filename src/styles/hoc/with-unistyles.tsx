import { ComponentType } from 'react';

import { withUnistyles } from 'react-native-unistyles';

import { UnistylesRuntime, UnistylesTheme } from '@/styles/unistyles';

export type WithTheme<T = unknown> = T & {
  theme: UnistylesTheme;
  rt: UnistylesRuntime;
};

export const withUniTheme = <T,>(Component: ComponentType<WithTheme<T>>) => {
  return withUnistyles(
    Component,
    (theme, rt) => ({ theme, rt }) as unknown as Partial<WithTheme<T>>,
  );
};
