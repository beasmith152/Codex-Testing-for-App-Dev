import { Platform } from 'react-native';

const systemFontFamilies =
  Platform.select({
    ios: {
      sans: 'system-ui',
      serif: 'ui-serif',
      rounded: 'ui-rounded',
      mono: 'ui-monospace',
    },
    web: {
      sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      serif: "Georgia, 'Times New Roman', serif",
      rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
      mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
    default: {
      sans: 'normal',
      serif: 'serif',
      rounded: 'normal',
      mono: 'monospace',
    },
  }) ?? {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  };

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
    somaBackground: '#F6EDE3',
    somaPrimary: '#4D5A3E',
    somaSecondary: '#363531',
    somaTertiary: '#9B8F87',
    somaText: '#4B3634',
    somaTextMuted: '#6C5B4E',
    somaSearch: '#F7F5F4',
    somaCard: '#E8D4BE',
    somaCardText: '#FFAE00',
    somaCardOutText: '#706250',
    somaButtonText: '#FFFEF9',
    somaLogo: '#434F36',
    somaMoodBg: '#D2B391',
    somaMoodSelBg: '#BAA894',
    somaMode: '#B39A82',
    somaTime: '#A57969',
    somaSearchText: '#181512',
    somaSurface: '#F2E6DA',
    somaSurfaceStrong: '#E8D6C4',
    somaOutline: '#D9C4AF',
    somaAccent1: '#F16C5B',
    somaAccent2: '#D48EB0',
    somaAccent3: '#A6C49F',
    somaAccent4: '#79A9D1',
    somaAccent5: '#97BA7A',
  },
  dark: {
    text: '#ECEDEE',
    background: '#3A291E',
    tint: tintColorDark,
    icon: '#BEC6CC',
    tabIconDefault: '#D4DAE0',
    tabIconSelected: tintColorDark,
    somaBackground: '#3C2F27',
    somaPrimary: '#CE7F6A',
    somaSecondary: '#D4CCC1',
    somaTertiary: '#BFB1AA',
    somaText: '#D5CFBD',
    somaTextMuted: '#B8B3AA',
    somaSearch: '#7E6A5E',
    somaCard: '#292019',
    somaCardText: '#EBD5B4',
    somaButtonText: '#D3D1C7',
    somaCardOutText: '#D8C7B2',
    somaLogo: '#CCC0BA',
    somaMoodBg: '#24201B',
    somaMoodSelBg: '#7C6B57',
    somaMode: '#44392E',
    somaTime: '#DDBD9E',
    somaSearchText: '#181512',
    somaSurface: '#4A3A31',
    somaSurfaceStrong: '#5A473C',
    somaOutline: '#7A685D',
    somaAccent1: '#F29B78',
    somaAccent2: '#C89AB6',
    somaAccent3: '#8DB094',
    somaAccent4: '#7AA4C4',
    somaAccent5: '#A9C68A',
  },
};

export const Fonts = {
  plante: 'Plante',
  biro: 'Biro',
  jost: 'Jost_400Regular',
  jostSemibold: 'Jost_600SemiBold',
  sans: systemFontFamilies.sans,
  serif: systemFontFamilies.serif,
  rounded: systemFontFamilies.rounded,
  mono: systemFontFamilies.mono,
};

export const Spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  section: 72,
};

export const Radii = {
  sm: 12,
  md: 20,
  lg: 28,
  xl: 40,
  pill: 999,
};

export const Shadows = {
  soft: {
    shadowColor: '#5A4633',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 6,
  },
  subtle: {
    shadowColor: '#4B3634',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
};

export const Typography = {
  title: {
    fontFamily: Fonts.plante,
    fontSize: 32,
    textAlign: 'center' as const,
    paddingBottom: 10,
  },
  subtitle: {
    fontFamily: Fonts.biro,
    fontSize: 26,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
    paddingBottom: 10,
  },
  body: {
    fontFamily: Fonts.jost,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center' as const,
  },
  bodyMood: {
    fontFamily: Fonts.jost,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center' as const,
  },
  bodyHeadingTitle: {
    fontFamily: Fonts.jostSemibold,
    fontSize: 20,
    lineHeight: 24,
    marginBottom: 10,
    textAlign: 'center' as const,
  },
  bodyTitle: {
    fontFamily: Fonts.jost,
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center' as const,
  },
  caption: {
    fontFamily: Fonts.jost,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center' as const,
  },
};
