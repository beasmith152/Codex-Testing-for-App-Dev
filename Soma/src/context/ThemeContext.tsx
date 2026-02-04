import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  isDarkMode: boolean;
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'soma_theme_mode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(savedTheme);
      } else {
        // No saved theme: use system preference
        const systemTheme = Appearance.getColorScheme(); // 'dark' | 'light' | null
        setTheme(systemTheme === 'dark' ? 'dark' : 'light');
      }
    } catch (e) {
      console.warn('Error loading theme preference', e);
      // fallback to system
      const systemTheme = Appearance.getColorScheme();
      setTheme(systemTheme === 'dark' ? 'dark' : 'light');
    } finally {
      setIsLoaded(true);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (e) {
      console.warn('Error saving theme preference', e);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode: theme === 'dark', theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
