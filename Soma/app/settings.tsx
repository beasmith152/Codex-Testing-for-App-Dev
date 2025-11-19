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

export default function SettingsScreen() {
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
           <ImageBackground
              source={require("../assets/images/soma-bg.png")}
              style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%" }}
              imageStyle={{ resizeMode: "cover", opacity: 0.3 }}
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
  ]}
  accessibilityRole="button"
  accessibilityLabel="Back to dashboard"
>
  <Text style={styles.backText}>←</Text>
</Pressable>
        <Text style={styles.title}>Settings</Text>

        <Pressable style={styles.primary} onPress={onSignup}>
          <Text style={styles.primaryText}>Create account</Text>
        </Pressable>

        <Pressable style={styles.secondary} onPress={onLogout}>
          <Text style={styles.secondaryText}>Log out</Text>
        </Pressable>

        <Pressable style={styles.destructive} onPress={onDeleteAccount}>
          <Text style={styles.destructiveText}>Delete account</Text>
        </Pressable>

        <Text style={styles.hint}>
          Notes: "Create account" should navigate into your full signup flow.
          "Log out" and "Delete account" must call your auth/backend logic.
        </Text>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F6EDE3" },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "flex-start",
  },
  title: { fontSize: 28, fontWeight: "700", color: "#1B3100", marginBottom: 24 },
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
  backgroundColor: "rgba(64,63,58,0.85)",
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
});