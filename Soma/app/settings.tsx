// app/settings.tsx
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ImageBackground,
  Alert,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/src/context/ThemeContext";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Typography } from '@/constants/theme';

const HIDE_SIGNUP = true;
const HIDE_SIGNIN = true;
export default function SettingsScreen() {
  const { isDarkMode, toggleTheme } = useTheme();
  // Set theme to system default
  const setDefaultTheme = async () => {
    try {
      await AsyncStorage.removeItem('soma_theme_mode');
      // Reload app theme from system
      // Optionally, you can force a reload or update context
      Alert.alert('Theme set to system default', 'Theme will now follow your device settings.');
    } catch (e) {
      console.warn('Error resetting theme', e);
    }
  };
  const colors = useThemeColors();

  const onSignup = () => {
    // navigate to the signup flow (create this screen later)
    router.push("/signup");
  };

  const onLogout = async () => {
    // TODO: replace with your auth sign-out flow (e.g. Firebase signOut())
    try {
      // clear local auth/session keys here if any
      // e.g. await AsyncStorage.multiRemove(["authToken", "userId"]);
      await AsyncStorage.removeItem("hasSeenWelcome"); // optional: show welcome again
    } catch (e) {
      console.warn("Error clearing storage", e);
    }
    // send user back to the welcome screen (replace so they can't go back)
    router.replace("/welcome");
  };

  const onDeleteAccount = () => {
    // Confirm then call your delete-account API
    Alert.alert(
      "Delete account",
      "This will permanently delete your account. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // TODO: call backend to delete account, then clear local session
              // await api.deleteAccount(...);
              await AsyncStorage.clear();
            } catch (err) {
              console.warn("Delete failed", err);
            }
            router.replace("/welcome");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.somaBackground }]}>
      <View style={styles.container}>
        <ImageBackground
          
          style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%" }}
          
        >
          <Pressable
            onPress={() => {
              try {
                router.back();
              } catch {
                router.replace("/(tabs)/dashboard");
              }
            }}
            style={({ pressed }) => [
              styles.backButton,
              pressed && { opacity: 0.8 },
              { backgroundColor: colors.somaCard },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Back to dashboard"
          >
            <Text style={styles.backText}>←</Text>
          </Pressable>
          
          <Text style={[Typography.title, { color: colors.somaText }]}>Settings</Text>
            <Text style={[Typography.bodyTitle, { color: colors.somaTextMuted, marginBottom: 20 }]}> Theme Settings </Text>
          {/* Dark Mode Toggle */}
          <Pressable
            style={[styles.themeToggle, { backgroundColor: colors.somaMode }]}
            onPress={toggleTheme}
          >
            <MaterialCommunityIcons
              name={isDarkMode ? "weather-night" : "weather-sunny"}
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.themeToggleText}>
              {isDarkMode ? "Dark Mode" : "Light Mode"}
            </Text>
          </Pressable>
          {/* System Default Theme Button */}
          <Pressable
            style={[styles.themeToggle, { backgroundColor: colors.somaCard, marginBottom: 24 }]}
            onPress={setDefaultTheme}
          >
            <MaterialCommunityIcons
              name="cellphone"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.themeToggleText}>Use System Theme</Text>
          </Pressable>
{!HIDE_SIGNUP && (
        <Pressable style={styles.primary} onPress={onSignup}>
          <Text style={styles.primaryText}>Create account</Text>
        </Pressable>
)}
{!HIDE_SIGNIN && (
        <Pressable style={styles.secondary} onPress={onLogout}>
          <Text style={styles.secondaryText}>Log out</Text>
        </Pressable>
)}
{!HIDE_SIGNIN && (
        <Pressable style={styles.primary} onPress={onSignin}>
          <Text style={styles.primaryText}>Sign in</Text>
        </Pressable>
)} 
        <Text style={[Typography.bodyTitle, { color: colors.somaTextMuted, marginTop: 0 }]}> Account Settings </Text>
        
        <Pressable style={styles.destructive} onPress={onDeleteAccount}>
          <Text style={styles.destructiveText}>Delete account</Text>
        </Pressable>
        <Text style={[Typography.caption, { paddingTop: 20, color: colors.somaTextMuted }]}>
          Note: All the data is currently stored locally on your device. Deleting your account will remove all data associated with it from this device. Account function coming soon.
        </Text>

       
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "flex-start",
  },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 24 },
  themeToggle: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    flexDirection: "row",
  },
  themeToggleText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  primary: {
    backgroundColor: "#E07A5F",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryText: { color: "#fff", fontWeight: "700" },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#403F3A",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  secondaryText: { color: "#403F3A", fontWeight: "700" },
  destructive: {
    backgroundColor: "#F25C5C",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  destructiveText: { color: "#fff", fontWeight: "700" },
  hint: { color: "#6b6b6b", fontSize: 13, marginTop: 18 },
  backButton: {
    position: "absolute",
    top: 24,
    left: 6,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
  },
  backText: {
    color: "#fff",
    fontSize: 20,
    lineHeight: 20,
    fontWeight: "700",
  },
  note: {
    marginTop: 14,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
});