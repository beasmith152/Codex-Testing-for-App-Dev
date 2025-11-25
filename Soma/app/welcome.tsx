// app/welcome.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, Image, ImageBackground, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

/**
 * TEST_MODE:
 * - true  => welcome always shows (no AsyncStorage) — good for styling/testing
 * - false => welcome shows once (uses AsyncStorage.hasSeenWelcome)
 */
const TEST_MODE = false;

export default function Welcome() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (TEST_MODE) {
      // Skip storage check when testing — show the screen immediately
      setChecking(false);
      return;
    }

    (async () => {
      const seen = await AsyncStorage.getItem("hasSeenWelcome");
      if (seen) {
        // skip welcome if already seen
        router.replace("/(tabs)"); // replace so user can't go back
        return;
      }
      setChecking(false);
    })();
  }, []);

  async function onContinue({ persist = false } = {}) {
    if (!TEST_MODE && persist) {
      await AsyncStorage.setItem("hasSeenWelcome", "1");
    }
    // In TEST_MODE we simply navigate; later you can set persist to true from settings
    router.replace("/(tabs)");
  }

  if (checking) return null;

  return (
    <SafeAreaView style={styles.container}>
        <ImageBackground
              source={require("../assets/images/soma-bg.png")}
              style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%" }}
              imageStyle={{ resizeMode: "cover", opacity: 0.3 }}
            >
        <Text style={styles.title}>Welcome to</Text>
     <Image
                    source={require("../assets/images/soma-logo.png")}
                     style={styles.logo}
                     resizeMode="contain"
                   />
        
        <Text style={styles.body}>
          Feel Grounded Again
        </Text>

<View style={styles.dotsRow}>
          {["#F16C5B", "#D48EB0", "#A6C49F", "#79A9D1", "#97BA7A"].map((c, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: c }]} />
          ))}
        </View>

        <Pressable
  style={({ pressed }) => [
    styles.signupButton,
    pressed && { opacity: 0.85 },
  ]}
  onPress={() => router.push("/signup")}
  accessibilityRole="button"
  accessibilityLabel="Sign up for an account"
>
  <Text style={styles.signupText}>Create account</Text>
</Pressable>

<Text style={styles.body2}>
          Already have an account?
        </Text>

        <Pressable
  style={({ pressed }) => [
    styles.accountButton,
    pressed && { opacity: 0.85 },
  ]}
  onPress={() => router.push("/signin")}
  accessibilityRole="button"
  accessibilityLabel="Sign in to your account"
>
  <Text style={styles.accountText}>Sign In</Text>
</Pressable>

<Text style={styles.body3}>
          OR
        </Text>

        <Pressable style={styles.button} onPress={() => onContinue()}>
          <Text style={styles.buttonText}>Touch here {"\n"} to get Started!</Text>
        </Pressable>

        {TEST_MODE ? (
          <Text style={styles.hint}>
            Test mode active — this screen will always appear until you set
            TEST_MODE = false.
          </Text>
        ) : (
          <Pressable
            style={[styles.button, styles.tertiary]}
            onPress={() => onContinue({ persist: true })}
          >
            <Text style={[styles.buttonText, styles.tertiaryText]}>
              Continue & Don't Show Again
            </Text>
          </Pressable>
        )}
      
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6EDE3",
  },
  logo: {
    width: 210,
    height: 155,
    marginTop:0,
    marginBottom: 1,
  },
  title: { fontSize: 26, fontWeight: "400", marginBottom: 8, color: "#1B3100" },
  body: {
    fontSize: 16,
    color: "#1B3100",
    marginBottom: 32,
    lineHeight: 22,
    textAlign: "center",
    width: "90%",
  },
    body2: {
    fontSize: 14,
    color: "#1B3100",
    marginBottom: 0,
    lineHeight: 22,
    textAlign: "center",
    width: "80%",
  },
    body3: {
    fontSize: 14,
    color: "#1B3100",
    marginBottom: 18,
    fontWeight: "700",
    lineHeight: 22,
    textAlign: "center",
    width: "80%",
  },
  button: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    textAlign: "center",
  },
  buttonText: { color: "#1B3100", fontWeight: "700", fontSize: 16, textAlign: "center" },
  tertiary: {
    backgroundColor: "#f2f2f2",
  },
  tertiaryText: {
    color: "#403F3A",
  },
  hint: {
    marginTop: 8,
    fontSize: 12,
    color: "#80776f",
    textAlign: "center",
  },
  signupButton: {
  backgroundColor: "#fcc53aff",
  borderWidth: 1,
  borderColor: "#eab531ff",
  paddingVertical: 12,
  borderRadius: 12,
  alignItems: "center",
  marginBottom: 20,
  paddingHorizontal: 24,
  paddingVertical: 12,
},
signupText: {
  color: "#ffffffff",
  fontWeight: "200",
  fontSize: 16,
},
  accountButton: {
  backgroundColor: "transparent",
  borderWidth: 1,
  borderColor: "transparent",
  paddingVertical: 12,
  borderRadius: 12,
  alignItems: "center",
  marginBottom: 12,
  paddingHorizontal: 24,
  paddingVertical: 12,
},
accountText: {
  color: "#1B3100",
  fontWeight: "400",
  fontSize: 16,
  textDecorationLine: "underline",
},
 dotsRow: {
    flexDirection: "row",
    marginBottom: 24,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginHorizontal: 5,
  },
});