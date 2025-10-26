import { createContext } from "react";
import { T_ThemeState } from "../types/theme-state.type";
import { E_Theme } from "../types/theme.enum";

export const ThemeContext = createContext<T_ThemeState | undefined>(undefined);
// Хук для использования темы
