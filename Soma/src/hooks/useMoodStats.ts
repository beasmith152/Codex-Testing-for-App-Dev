import { getSessions } from "./useSessionStorage";

// local helper to build a YYYY-MM-DD key in *local* time
function makeLocalDayKey(d: Date) {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

export async function getMoodStats() {
  const sessions = await getSessions();
  if (!sessions || sessions.length === 0) return null;

  // ✅ Normalize legacy + new sessions
  const norm = sessions.map((s: any) => {
    const ts =
      typeof s.ts === "number"
        ? s.ts
        : s.dateISO
        ? Date.parse(s.dateISO)
        : s.date
        ? Date.parse(s.date)
        : Date.now();

    const dateLocalKey =
      s.dateLocalKey ?? makeLocalDayKey(new Date(ts));

    return {
      ...s,
      ts,
      dateLocalKey,
    };
  });

  // ✅ Sort by time (oldest → newest)
  const sorted = norm.sort((a: any, b: any) => a.ts - b.ts);

  // ✅ Most recent exercise label
  const recentExercise = sorted.length ? sorted[sorted.length - 1].exercise ?? null : null;

  // ✅ Group by local day key (no UTC shift)
  const byDay: Record<string, any[]> = {};
  for (const s of sorted) {
    const key = s.dateLocalKey;
    if (!byDay[key]) byDay[key] = [];
    byDay[key].push(s);
  }

  // ✅ Totals + daily-averaged mood score
  let totalExercises = 0;
  let totalTime = 0;
  const moodWeights: Record<string, number> = {
    Happy: 5,
    Calm: 4,
    Neutral: 3,
    Sad: 2,
    Stressed: 1,
    Anxious: 1,
  };
  let totalMoodScore = 0;

  Object.values(byDay).forEach((daySessions) => {
    let dayScore = 0;
    daySessions.forEach((s: any) => {
      totalExercises++;
      totalTime += Number(s.duration) || 0;
      dayScore += moodWeights[s.mood] ?? 3;
    });
    totalMoodScore += dayScore / daySessions.length; // daily average
  });

  const dayCount = Object.keys(byDay).length || 1;
  const avgMoodScore = totalMoodScore / dayCount;

  let avgMood = "Neutral";
  if (avgMoodScore >= 4) avgMood = "Happy";
  else if (avgMoodScore >= 3.5) avgMood = "Calm";
  else if (avgMoodScore >= 2.5) avgMood = "Neutral";
  else if (avgMoodScore >= 1.5) avgMood = "Sad";
  else avgMood = "Stressed";

  return {
    totalExercises,
    totalTime,
    avgMood,
    byDay,
    recentExercise, // ✅ used by dashboard "Go to exercise"
  };
}

// 👇 keep at top level
export const moodColors: Record<string, string> = {
  Happy: "#FFD166",
  Calm: "#A5D6A7",
  Sad: "#90CAF9",
  Stressed: "#FF8A65",
  Anxious: "#CE93D8",
  Neutral: "#E0E0E0",
};
