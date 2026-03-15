import { createContext } from "react";
import { T_ThemeState } from "../types/theme-state.type";

export const ThemeContext = createContext<T_ThemeState | undefined>(undefined);
// Хук для использования темы
