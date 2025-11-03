import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { useMood } from "../../src/context/MoodContext";
import MoodSelector from "../../src/components/MoodSelector";

// 🔍 Searchable list (moods + exercises)
const exerciseList = [
  { label: "Box Breathing", mood: "Stressed" },
  { label: "Clench & Release", mood: "Stressed" },
  { label: "Shake Out", mood: "Restless" },
  { label: "Feet Grounding", mood: "Restless" },
  { label: "Spine Stretch", mood: "Drained" },
  { label: "Self-Hug", mood: "Drained" },
  { label: "5-4-3-2-1 Grounding", mood: "Distracted" },
  { label: "Eye Palming / Orientation", mood: "Distracted" },
  { label: "Belly / Diaphragmatic Breath", mood: "Baseline" },
  { label: "Mini Body Scan", mood: "Baseline" },
  { label: "Stressed", mood: "Stressed" },
  { label: "Restless", mood: "Restless" },
  { label: "Drained", mood: "Drained" },
  { label: "Distracted", mood: "Distracted" },
  { label: "Baseline", mood: "Baseline" },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const { setMood } = useMood();

  // ✅ Filter both moods + exercises
  const filteredExercises = exerciseList.filter((ex) =>
    ex.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, how are you?</Text>

      {/* 🔍 Search Bar Container */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search exercises or moods..."
          placeholderTextColor="#7A7A7A"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable
            onPress={() => setSearchQuery("")}
            style={styles.clearButton}
          >
            <Text style={styles.clearText}>×</Text>
          </Pressable>
        )}
      </View>

      {/* 🔎 Floating Overlay for Search Results */}
      {searchQuery.length > 0 && (
        <View style={styles.overlay}>
          <ScrollView
            contentContainerStyle={styles.resultsContainer}
            showsVerticalScrollIndicator={false}
          >
            {filteredExercises.length > 0 ? (
              filteredExercises.map((ex, index) => (
                <Pressable
                  key={index}
                  style={({ pressed }) => [
                    styles.resultCard,
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={() => {
                    setMood(ex.mood.toLowerCase());
                    setSearchQuery("");
                    router.push("/(tabs)/exercise-flow");
                  }}
                >
                  <Text style={styles.resultLabel}>{ex.label}</Text>
                  <Text style={styles.resultSub}>{ex.mood}</Text>
                </Pressable>
              ))
            ) : (
              <Text style={styles.noResults}>No results found</Text>
            )}
          </ScrollView>
        </View>
      )}

      {/* 🌿 Mood Selector */}
      <MoodSelector />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6EDE3",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 70,
  },
  title: {
    fontSize: 28,
    color: "#403F3A",
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  searchContainer: {
    position: "relative",
    width: "100%",
  },
  searchBar: {
    width: "100%",
    backgroundColor: "#EAD8CA",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    color: "#403F3A",
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  clearButton: {
    position: "absolute",
    right: 12,
    top: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  clearText: {
    fontSize: 20,
    color: "#403F3A",
    fontWeight: "700",
  },
  overlay: {
    position: "absolute",
    top: 150, // sits just under search bar
    left: 24,
    right: 24,
    backgroundColor: "#EAD8CA",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 50,
    maxHeight: 220,
  },
  resultsContainer: {
    paddingVertical: 10,
  },
  resultCard: {
    backgroundColor: "#EAD8CA",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 6,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#403F3A",
  },
  resultSub: {
    fontSize: 13,
    color: "#507050",
  },
  noResults: {
    textAlign: "center",
    color: "#403F3A",
    fontStyle: "italic",
  },
});
