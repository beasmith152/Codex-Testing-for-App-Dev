import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Timer({
  initialSeconds = 60,
  onComplete,
}: {
  initialSeconds?: number;
  onComplete?: () => void;
}) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true); // starts automatically
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            if (onComplete) onComplete(); // trigger callback
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current!);
  }, [isRunning]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Time Remaining</Text>
      <Text style={styles.time}>{formatTime(seconds)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginVertical: 16 },
  label: { fontSize: 18, color: "#403F3A", fontWeight: "600" },
  time: { fontSize: 48, fontWeight: "700", color: "#507050", marginTop: 8 },
});
