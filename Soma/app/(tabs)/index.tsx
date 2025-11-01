import { View, Text, StyleSheet } from "react-native";
import MoodSelector from "../../src/components/MoodSelector";




export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Soma 🌿</Text>
      <Text style={styles.subtitle}>Feel grounded again.</Text>
       <MoodSelector />
    </View>
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
    fontSize: 28,
    color: "#403F3A",
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#403F3A",
  },
});
