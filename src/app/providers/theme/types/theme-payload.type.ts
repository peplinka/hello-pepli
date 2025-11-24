import { E_ThemeAction } from "./theme-action.enum";
import { E_Theme } from "./theme.enum";

export type T_ThemePayload = {
  [E_ThemeAction.Toggle]: undefined,
  [E_ThemeAction.Set]: E_Theme
}