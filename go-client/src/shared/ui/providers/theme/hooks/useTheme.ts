import { useContext } from "react";
import { ThemeContext } from "../context/Theme.Context";

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context; // возвращает { theme: 'light' | 'dark' }
};
