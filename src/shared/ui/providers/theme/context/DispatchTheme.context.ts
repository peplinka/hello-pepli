import { createContext, Dispatch } from "react";
import { T_ThemeAction } from "../types/theme-action.type";

export const DispatchThemeContext = createContext<Dispatch<T_ThemeAction>>(
  () => {},
);
