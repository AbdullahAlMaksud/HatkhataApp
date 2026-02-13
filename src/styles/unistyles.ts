// import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

// import { breakpoints, darkTheme, lightTheme } from '@/styles/theme';

// const appThemes = {
//   light: lightTheme,
//   dark: darkTheme,
// };

// type AppBreakpoints = typeof breakpoints;
// type AppThemes = typeof appThemes;

// // Define UnistylesTheme type based on our themes
// export type UnistylesTheme = typeof lightTheme | typeof darkTheme;

// // Re-export UnistylesRuntime for convenience
// export type { UnistylesRuntime };

// declare module 'react-native-unistyles' {
//   // eslint-disable-next-line @typescript-eslint/no-empty-object-type
//   export interface UnistylesThemes extends AppThemes {}
//   // eslint-disable-next-line @typescript-eslint/no-empty-object-type
//   export interface UnistylesBreakpoints extends AppBreakpoints {}
// }

// StyleSheet.configure({
//   settings: {
//     initialTheme: 'light',
//   },
//   breakpoints,
//   themes: appThemes,
// });

import { UnistylesRuntime } from 'node_modules/react-native-unistyles/lib/typescript/src/specs/UnistylesRuntime/UnistylesRuntime.nitro';
import { UnistylesTheme } from 'node_modules/react-native-unistyles/lib/typescript/src/types';
import { StyleSheet } from 'react-native-unistyles';

import { breakpoints, darkTheme, lightTheme } from '@/styles/theme';

const appThemes = {
  light: lightTheme,
  dark: darkTheme,
};

type AppBreakpoints = typeof breakpoints;
type AppThemes = typeof appThemes;

export type { UnistylesRuntime, UnistylesTheme };

declare module 'react-native-unistyles' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface UnistylesThemes extends AppThemes {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  settings: {
    initialTheme: 'light',
  },
  breakpoints,
  themes: appThemes,
});
