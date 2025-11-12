import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "soma_sessions";

// Format a local YYYY-MM-DD key (no UTC shifting)
function makeLocalDayKey(d: Date) {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

export async function saveSession(partial: {
  mood: string;
  exercise: string;
  duration: number;
}) {
  try {
    const now = new Date();

    const session = {
      ...partial,
      // canonical time fields
      ts: now.getTime(),            // local epoch ms (use for display/sorting)
      dateISO: now.toISOString(),   // keep ISO for completeness
      dateLocalKey: makeLocalDayKey(now), // group by this in stats/calendar
    };

    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const sessions = existing ? JSON.parse(existing) : [];
    sessions.push(session);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    return session;
  } catch (e) {
    console.error("Error saving session", e);
  }
}

export async function getSessions() {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const sessions = existing ? JSON.parse(existing) : [];

    // 🔧 Backfill old entries so everything has ts/dateLocalKey going forward
    let mutated = false;
    for (const s of sessions) {
      if (!s.ts) {
        const base =
          s.dateLocalKey
            ? new Date(s.dateLocalKey + "T12:00:00") // noon local to avoid DST edge cases
            : s.dateISO
            ? new Date(s.dateISO)
            : s.date
            ? new Date(s.date)
            : new Date();

        s.ts = base.getTime();
        s.dateLocalKey = makeLocalDayKey(base);
        if (!s.dateISO) s.dateISO = new Date(s.ts).toISOString();
        mutated = true;
      } else if (!s.dateLocalKey) {
        s.dateLocalKey = makeLocalDayKey(new Date(s.ts));
        mutated = true;
      }
    }
    if (mutated) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }

    return sessions;
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
