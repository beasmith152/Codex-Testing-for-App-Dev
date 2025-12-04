// app/signup.tsx
// NOTE: This file has been repurposed as a Sign In screen.
// When you're ready you can split into `signin.tsx` and `signup.tsx`.
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
    Image,
  Alert,
} from "react-native";
import { router } from "expo-router";

/**
 * signIn stub: replace with real auth call later (return token/user).
 * On success, persist auth (SecureStore / AsyncStorage) and route into app.
 */
async function signIn(data: { email: string; password: string }) {
  await new Promise((r) => setTimeout(r, 700)); // simulate latency
  // TODO: replace with API call, validate response, return token/user
  if (data.email === "fail@example.com") {
    return { success: false, message: "Invalid credentials" };
  }
  return { success: true, userId: "local-test-id", token: "fake-token" };
}

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.trim()) return "Please enter your email.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email.";
    if (!password) return "Please enter your password.";
    return null;
  };

  const onSubmit = async () => {
    const err = validate();
    if (err) {
      Alert.alert("Validation", err);
      return;
    }

    setLoading(true);
    try {
      const res = await signIn({ email, password });
      if (res?.success) {
        // TODO: persist auth token or user info here (e.g., SecureStore/AsyncStorage)
        // e.g. await SecureStore.setItemAsync('authToken', res.token)
        router.replace("/(tabs)"); // enter the main app
      } else {
        Alert.alert("Sign in failed", res?.message || "Unknown error");
      }
    } catch (e: any) {
      Alert.alert("Sign in error", e?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ImageBackground
          source={require("../assets/images/soma-bg.png")}
          style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%" }}
          imageStyle={{ resizeMode: "cover", opacity: 0.3 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
             <Image
                                            source={require("../assets/images/soma-logo.png")}
                                             style={styles.logo}
                                             resizeMode="contain"
                                           />
            <View style={styles.card}>
              <Text style={styles.header}>Welcome back</Text>
              <Text style={styles.sub}>Sign in to continue to Soma.</Text>

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#9B8F87"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                returnKeyType="next"
                accessibilityLabel="Email"
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#9B8F87"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                returnKeyType="done"
                accessibilityLabel="Password"
              />

              <Pressable
                style={({ pressed }) => [
                  styles.primary,
                  (pressed || loading) && { opacity: 0.85 },
                ]}
                onPress={onSubmit}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Sign in"
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Sign in</Text>}
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.secondary,
                  pressed && { opacity: 0.85 },
                ]}
                onPress={() => router.push("/signup")} // route to signup when you create it
                accessibilityRole="button"
                accessibilityLabel="Create an account"
              >
                <Text style={styles.secondaryText}>Create account</Text>
              </Pressable>

              <Pressable
                onPress={() => router.push("/forgot-password")} // placeholder route
                style={({ pressed }) => [{ marginTop: 10 }, pressed && { opacity: 0.8 }]}
              >
                <Text style={styles.linkText}>Forgot password?</Text>
              </Pressable>

              <Text style={styles.note}>
                Note: This feature is not yet implemented. Will be available in future updates.
              </Text>
            </View>
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F6EDE3", width: "100%", justifyContent: "center", alignItems: "center" },
  scrollContent: { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20, paddingVertical: 40 },
  card: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 325,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  logo: {
    width: 210,
    height: 155,
    marginTop:0,
    marginBottom: 1,
  },
  header: { fontSize: 22, fontWeight: "700", color: "#1B3100", marginBottom: 6 },
  sub: { color: "#6B7A60", marginBottom: 16, fontSize: 14, lineHeight: 20 },
  input: {
    backgroundColor: "#fff",
    borderColor: "#EAE3DC",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    color: "#403F3A",
  },
  primary: { backgroundColor: "#E07A5F", paddingVertical: 14, borderRadius: 12, alignItems: "center", marginTop: 8 },
  primaryText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#403F3A",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  secondaryText: { color: "#403F3A", fontWeight: "700" },
  linkText: { color: "#6B7A60", textAlign: "center", textDecorationLine: "underline" },
  note: { marginTop: 14, color: "#80776F", fontSize: 12, textAlign: "center" },
});