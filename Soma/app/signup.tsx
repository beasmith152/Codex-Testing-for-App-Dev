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
 * Signup placeholder prepared for future DB/auth integration.
 * - Replace `createAccount` with your API call (return tokens, user id, etc.)
 * - After successful signup persist auth (SecureStore / AsyncStorage / your provider).
 * - Consider additional checks (email verification, password strength, rate limits).
 */

/* Stub: simulate server call. Replace with backend integration. */
async function createAccount(data: {
  name: string;
  email: string;
  password: string;
}) {
  // TODO: call your backend here, e.g. fetch('/api/signup', { method: 'POST', body: JSON.stringify(data) })
  // - Return token/user on success
  // - Throw or return { success: false, message: '...' } on failure
  await new Promise((r) => setTimeout(r, 800)); // simulate latency
  return { success: true, userId: "local-test-id" };
}

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!name.trim()) return "Please enter your name.";
    if (!email.trim()) return "Please enter your email.";
    // simple email check
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirm) return "Passwords do not match.";
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
      const res = await createAccount({ name, email, password });
      if (res?.success) {
        // TODO: persist auth token or user info here (e.g., AsyncStorage or SecureStore)
        // e.g. await AsyncStorage.setItem('authToken', res.token)
        // navigate into the app (replace so signup isn't on the back stack)
        router.replace("/(tabs)");
      } else {
        Alert.alert("Sign up failed", res?.message || "Unknown error");
      }
    } catch (e: any) {
      Alert.alert("Sign up error", e?.message || "An error occurred");
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
            
          <View style={styles.card}>
            <Text style={styles.header}>Create your account</Text>
            <Text style={styles.sub}>
              Sign up to save progress, sync across devices, and get personalized
              features.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor="#9B8F87"
              value={name}
              onChangeText={setName}
              returnKeyType="next"
              importantForAutofill="yes"
              accessibilityLabel="Full name"
            />

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
              returnKeyType="next"
              accessibilityLabel="Password"
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor="#9B8F87"
              secureTextEntry
              value={confirm}
              onChangeText={setConfirm}
              returnKeyType="done"
              accessibilityLabel="Confirm password"
            />

            <Pressable
              style={({ pressed }) => [
                styles.primary,
                (pressed || loading) && { opacity: 0.85 },
              ]}
              onPress={onSubmit}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Create account"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryText}>Create account</Text>
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.secondary,
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => router.push("/welcome")}
              accessibilityRole="button"
              accessibilityLabel="Back to dashboard"
            >
              <Text style={styles.secondaryText}>Back to app</Text>
            </Pressable>

            <Text style={styles.note}>
              Note: This is a UI-only signup for now. Replace `createAccount`
              with your backend call and persist auth tokens when ready.
            </Text>
          </View>
        </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F6EDE3", width: "100%", justifyContent: "center", alignItems: "center" }, // global bg should be visible
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
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
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1B3100",
    marginBottom: 6,
  },
  sub: {
    color: "#6B7A60",
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 20,
  },
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
  primary: {
    backgroundColor: "#E07A5F",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#403F3A",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  secondaryText: {
    color: "#403F3A",
    fontWeight: "700",
  },
  note: {
    marginTop: 14,
    color: "#80776F",
    fontSize: 12,
    textAlign: "center",
  },
});