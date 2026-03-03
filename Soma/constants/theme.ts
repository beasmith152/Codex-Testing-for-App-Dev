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
    somaBackground: '#f5e5d4',
    somaPrimary: '#4d5a3e',
    somaSecondary: '#363531',
    somaTertiary: '#9B8F87',
    somaText: '#4b3634',
    somaTextMuted: '#605145',
    somaSearch: '#f7f5f4',
    somaCard: '#e8d4be',
    somaCardText: '#ffae00',
    somaCardOutText: '#706250',
    somaButtonText: '#fffef9',
    somaLogo: '#434f36',
    somaMoodBg: '#d2b391',
    somaMoodSelBg: '#baa894',
    somaMode: '#b39a82',
    somaTime: '#a57969',
    somaSearchText: '#181512',
  },
  dark: {
    text: '#ECEDEE',
    background: '#3a291e',
    tint: tintColorDark,
    icon: '#bec6cc',
    tabIconDefault: '#d4dae0',
    tabIconSelected: tintColorDark,
    // Soma theme dark colors - complementary dark version
    somaBackground: '#3c2f27',
    somaPrimary: '#ce7f6a',
    somaSecondary: '#D4CCC1',
    somaTertiary: '#bfb1aa',
    somaText: '#d5cfbd',
    somaTextMuted: '#b8b3aa',
    somaSearch: '#7e6a5e',
    somaCard: '#292019',
    somaCardText: '#ebd5b4',
    somaButtonText: '#d3d1c7',
    somaCardOutText: '#d8c7b2',
    somaLogo: '#ccc0ba',
    somaMoodBg: '#24201b',
    somaMoodSelBg: '#7c6b57',
    somaMode: '#44392e',
    somaTime: '#ddbd9e',
    somaSearchText: '#181512',
  },
};
// Typography styles and font families & spacing
export const Fonts = {
  plante: 'Plante',
  biro: 'Biro',
  jost: 'Jost_400Regular',
  jostSemibold: 'Jost_600SemiBold',
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
  bodyMood: {
    fontFamily: Fonts.jost,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  bodyHeadingTitle: {
    fontFamily: Fonts.jost,
    fontSize: 20,
    lineHeight: 24,
    marginBottom: 10,
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