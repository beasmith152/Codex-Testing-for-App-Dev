import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "soma_sessions";

export async function saveSession(session: any) {
  try {
    // ✅ Convert to local time before saving to avoid UTC date shift
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);

    const sessionWithLocalDate = {
      ...session,
      date: localDate.toISOString(), // replaces UTC ISO with local ISO
    };

    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const sessions = existing ? JSON.parse(existing) : [];
    sessions.push(sessionWithLocalDate);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error("Error saving session", e);
  }
}

export async function getSessions() {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch (e) {
    console.error("Error loading sessions", e);
    return [];
  }
}

export async function clearSessions() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Error clearing sessions", e);
  }
}
