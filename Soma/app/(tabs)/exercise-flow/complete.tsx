import { View, Text, Pressable, StyleSheet, SafeAreaView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

// 👇 Hide top header (keeps bottom tabs visible)
export const unstable_settings = {
  headerShown: false,
};

export default function Complete() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { paddingBottom: insets.bottom || 16, backgroundColor: "#F6EDE3" },
      ]}
    >
      <Text style={styles.title}>Great Job!</Text>
      <Text style={styles.subtitle}>Take a moment to notice how you feel.</Text>

      {/* ✅ Fixed route path so it correctly returns to Home */}
      

      <Pressable
        style={styles.secondaryButton}
        onPress={() => router.push("/(tabs)/calendar")}
      >
        <Text style={styles.secondaryText}>View Calendar</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6EDE3",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 60,
    fontWeight: "700",
    color: "#1B3100",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 24,
    color: "#362214ff",
    marginBottom: 28,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: "#c18c24ff",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 15,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  primaryText: {
    color: "#403F3A",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "#fcc53aff",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  secondaryText: {
    color: "#ffffffff",
    fontWeight: "600",
    fontSize: 15,
  },
});
