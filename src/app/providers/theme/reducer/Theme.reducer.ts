import { T_ThemeState } from "../types/theme-state.type";
import { T_ThemeAction } from "../types/theme-action.type";
import { E_Theme } from "../types/theme.enum";
import { E_ThemeAction } from "../types/theme-action.enum";

export const themeReducer = (state: T_ThemeState, action: T_ThemeAction): T_ThemeState => {
  switch (action.type) {
    // Теперь тип действия - один из перечисления. Если мы попробуем указать что-то другое - получим ошибку
    case E_ThemeAction.Toggle: {
      return {
        ...state,
        // За счет ActionMap в E_ThemeAction.Toggle нет payload
        theme: state.theme === E_Theme.Light ? E_Theme.Dark : E_Theme.Light,
      }
    }
    case E_ThemeAction.Set: {
      return {
        ...state,
        // За счет ActionMap в E_ThemeAction.Set есть payload
        theme: action.payload,
      }
    }

    default: {
      // Проверка на случай добавления новых Action в будущем
      const exhaustiveCheck: never = action;
      return state;
    }
  }
}