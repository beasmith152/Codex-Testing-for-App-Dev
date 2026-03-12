import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { MoodProvider } from "../src/context/MoodContext";
import { ThemeProvider as SomaThemeProvider } from "../src/context/ThemeContext";
import { ProfileProvider } from "../src/context/ProfileContext";
import { StyleSheet, View } from "react-native";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useFonts } from 'expo-font';
import { Jost_400Regular, Jost_600SemiBold } from '@expo-google-fonts/jost';
import Svg, { Path } from 'react-native-svg';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootStackWithBackdrop() {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.somaBackground }]}> 
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <Svg
          height="100%"
          preserveAspectRatio="xMidYMax meet"
          viewBox="0 0 420 920"
          width="100%"
        >
          <Path
            d="M80 920 C120 870, 190 860, 240 890 C290 860, 355 875, 400 920 Z"
            fill={colors.somaPrimary}
            opacity={0.02}
          />
          <Path
            d="M210 900 C180 900, 166 870, 166 834 L166 262 C166 208, 184 178, 210 178 C236 178, 254 208, 254 262 L254 834 C254 870, 240 900, 210 900 Z"
            fill={colors.somaPrimary}
            opacity={0.05}
          />
          <Path
            d="M166 664 C138 660, 116 636, 116 604 L116 484 C116 452, 132 430, 152 430 C172 430, 186 452, 186 484 L186 554 C186 602, 178 636, 166 664 Z"
            fill={colors.somaPrimary}
            opacity={0.05}
          />
          <Path
            d="M254 620 C284 616, 306 592, 306 560 L306 438 C306 406, 290 384, 270 384 C250 384, 236 406, 236 438 L236 504 C236 552, 244 588, 254 620 Z"
            fill={colors.somaPrimary}
            opacity={0.05}
          />
        </Svg>
      </View>
      <View style={styles.stackHost}>
        <Stack>
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="signin" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
        </Stack>
      </View>
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Plante: require('../assets/fonts/Plante.ttf'),
    Biro: require('../assets/fonts/biro.otf'),
    Jost_400Regular,
    Jost_600SemiBold,
  });

 if (!fontsLoaded) {
    return null;
  }

 return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SomaThemeProvider>
        <MoodProvider>
          <ProfileProvider>
            <RootStackWithBackdrop />
          </ProfileProvider>
        </MoodProvider>
      </SomaThemeProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stackHost: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
