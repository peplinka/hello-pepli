import { FC, ReactNode, useEffect, useReducer } from "react";
import { ThemeContext } from "../context/Theme.Context";
import { DispatchThemeContext } from "../context/DispatchTheme.context";
import { themeReducer } from "../reducer/Theme.reducer";
import { E_Theme } from "../types/theme.enum";

interface I_ThemeProviderProps {
  children: ReactNode;
}

const getInitialTheme = (): E_Theme => {
  const saved = localStorage.getItem("theme");
  if (saved === E_Theme.Dark || saved === E_Theme.Light) {
    return saved;
  }
  return E_Theme.Light; // fallback
};

export const ThemeProvider: FC<I_ThemeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, {
    theme: getInitialTheme(),
  });

  useEffect(() => {
    localStorage.setItem("theme", state.theme);
    if (state.theme === E_Theme.Dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [state.theme]);

  return (
    <ThemeContext.Provider value={state}>
      <DispatchThemeContext.Provider value={dispatch}>
        {children}
      </DispatchThemeContext.Provider>
    </ThemeContext.Provider>
  );
};
