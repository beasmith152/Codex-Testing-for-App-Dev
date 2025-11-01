import { createContext, useContext, useState, ReactNode } from "react";

type MoodContextType = {
  mood: string | null;
  setMood: (m: string | null) => void;
};

const MoodContext = createContext<MoodContextType>({
  mood: null,
  setMood: () => {},
});

export function MoodProvider({ children }: { children: ReactNode }) {
  const [mood, setMood] = useState<string | null>(null);
  return (
    <MoodContext.Provider value={{ mood, setMood }}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  return useContext(MoodContext);
}
