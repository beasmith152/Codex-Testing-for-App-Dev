/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#4d4c4c';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    // Soma theme light colors
    somaBackground: '#ffece1',
    somaPrimary: '#4d5a3e',
    somaSecondary: '#363531',
    somaTertiary: '#9B8F87',
    somaText: '#4b3634',
    somaTextMuted: '#80776F',
    somaSearch: '#ffffff',
    somaCard: '#f2ded2',
    somaCardText: '#fffef9',
    somaButtonText: '#fffef9',
  },
  dark: {
    text: '#ECEDEE',
    background: '#3a291e',
    tint: tintColorDark,
    icon: '#bec6cc',
    tabIconDefault: '#d4dae0',
    tabIconSelected: tintColorDark,
    // Soma theme dark colors - complementary dark version
    somaBackground: '#72665e',
    somaPrimary: '#E07A5F',
    somaSecondary: '#D4CCC1',
    somaTertiary: '#8B7E77',
    somaText: '#E8E4DE',
    somaTextMuted: '#b8b3aa',
    somaSearch: '#5c4e45',
    somaCard: '#615750',
    somaCardText: '#fffef9',
    somaButtonText: '#fffef9',
  },
};
// Typography styles and font families & spacing
export const Fonts = {
  plante: 'Plante',
  biro: 'Biro',
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
};
export const Typography = {
  title: {
    fontFamily: Fonts.plante,
    fontSize: 32,
    textAlign: 'center',
    paddingBottom: 10,
  },
  subtitle: {
    fontFamily: Fonts.biro,
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    paddingBottom: 10,
  },
  body: {
    fontFamily: Fonts.mono,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  bodyTitle: {
    fontFamily: Fonts.mono,
    fontSize: 18,
    fontWeight: '100',
    lineHeight: 28,
    textAlign: 'center',
  },
  caption: {
    fontFamily: Fonts.mono,
    fontSize: 8,
    lineHeight: 16,
    textAlign: 'center',
  },
  // Add more as needed
};