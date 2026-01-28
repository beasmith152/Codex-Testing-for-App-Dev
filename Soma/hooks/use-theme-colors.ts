import { Colors } from '@/constants/theme';
import { useTheme } from '@/src/context/ThemeContext';

export function useThemeColors() {
  const { isDarkMode } = useTheme();
  return isDarkMode ? Colors.dark : Colors.light;
}
