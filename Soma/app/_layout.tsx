import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { MoodProvider } from "../src/context/MoodContext";
import { ThemeProvider as SomaThemeProvider } from "../src/context/ThemeContext";
import { ProfileProvider } from "../src/context/ProfileContext";
import { View, ImageBackground } from "react-native";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFonts } from 'expo-font';
import { Jost_400Regular, Jost_600SemiBold } from '@expo-google-fonts/jost';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Plante: require('../assets/fonts/Plante.ttf'),
    Biro: require('../assets/fonts/biro.otf'),
    Jost_400Regular,
    Jost_600SemiBold,
  });
const bgSource = require("../assets/images/soma-bg.png"); // <- ensure file exists
const fallbackBg = colorScheme === "dark" ? "#F6EDE3" : "#F6EDE3"; 

 if (!fontsLoaded) {
    return null;
  }

 return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SomaThemeProvider>
        <MoodProvider>
          <ProfileProvider>
            <ImageBackground
              source={require("../assets/images/soma-bg.png")}
              style={{ flex: 1 }}
              imageStyle={{ resizeMode: "cover" }}
            >
              <View style={{ flex: 1, backgroundColor: "transparent" }}>
                <Stack>
                  <Stack.Screen name="welcome" options={{ headerShown: false }} />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="settings" options={{ headerShown: false }} />
                  <Stack.Screen name="signin" options={{ headerShown: false }} />
                  <Stack.Screen name="signup" options={{ headerShown: false }} />
                  <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
                </Stack>
              </View>
            </ImageBackground>
          </ProfileProvider>
        </MoodProvider>
      </SomaThemeProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
