import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { View, Text, StyleSheet } from "react-native";

const Timer = forwardRef(
  (
    {
      initialSeconds = 60,
      onComplete,
    }: {
      initialSeconds?: number;
      onComplete?: () => void;
    },
    ref
  ) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // ✅ Cleanly start the timer every time the component mounts or duration changes
    useEffect(() => {
      startTimer();

      // Cleanup interval on unmount
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }, [initialSeconds]);

    // ✅ Core timer logic
    const startTimer = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setSeconds(initialSeconds);

      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            if (onComplete) onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    // ✅ Expose stop/reset to parent (for “I don’t like this”)
    useImperativeHandle(ref, () => ({
      stop: () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      },
      reset: () => {
        startTimer();
      },
    }));

    // ✅ Display minutes + seconds
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
);

export default Timer;

const styles = StyleSheet.create({
  container: { alignItems: "center", marginVertical: 16 },
  label: { fontSize: 18, color: "#403F3A", fontWeight: "600" },
  time: { fontSize: 48, fontWeight: "700", color: "#507050", marginTop: 8 },
});
