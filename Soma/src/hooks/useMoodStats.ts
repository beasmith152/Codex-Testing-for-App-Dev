import { getSessions } from "./useSessionStorage";

export async function getMoodStats() {
  const sessions = await getSessions();
  if (!sessions || sessions.length === 0) return null;

  // ✅ sort sessions by date so newest is last
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // ✅ track most recent exercise
  const recentExercise = sortedSessions[sortedSessions.length - 1]?.exercise || null;

  // convert to LOCAL date objects (fixes UTC shift issue)
  const byDay: Record<string, any[]> = {};
  sortedSessions.forEach((s) => {
    const local = new Date(s.date);
    const day =
      local.getFullYear() +
      "-" +
      String(local.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(local.getDate()).padStart(2, "0"); // YYYY-MM-DD (local time)
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(s);
  });

  // calculate totals
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

  // ✅ daily averages (each day counts equally)
  Object.values(byDay).forEach((sessions) => {
    let dayScore = 0;
    sessions.forEach((s) => {
      totalExercises++;
      totalTime += s.duration;
      dayScore += moodWeights[s.mood] || 3;
    });
    const dayAvg = dayScore / sessions.length;
    totalMoodScore += dayAvg;
  });

  // ✅ average by day count
  const avgMoodScore = totalMoodScore / Object.keys(byDay).length;

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
    recentExercise, // ✅ NEW field
  };
}

// 👇 this must be OUTSIDE the function — top level only
export const moodColors: Record<string, string> = {
  Happy: "#FFD166",
  Calm: "#A5D6A7",
  Sad: "#90CAF9",
  Stressed: "#FF8A65",
  Anxious: "#CE93D8",
  Neutral: "#E0E0E0",
};
