import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { MoodProvider } from "../src/context/MoodContext";
import { View, ImageBackground } from "react-native";
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
const bgSource = require("../assets/images/soma-bg.png"); // <- ensure file exists
const fallbackBg = colorScheme === "dark" ? "#F6EDE3" : "#F6EDE3"; 

 return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <MoodProvider>
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
      <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
    </Stack>
  </View>
</ImageBackground>
      </MoodProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
