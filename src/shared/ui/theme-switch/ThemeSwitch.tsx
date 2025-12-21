import { SwitchBase } from "@/shared/ui/switch/base/Switch.base";
import { SwitchOption } from "@/shared/ui/switch/option/Switch.option";
import { useTheme, useDispatchTheme } from "@/shared/ui/providers/theme";
import { LightThemeIcon } from "./LightThemeIcon";
import { DarkThemeIcon } from "./DarkThemeIcon";
import { E_Theme } from "@/shared/ui/providers/theme/types/theme.enum";
import { E_ThemeAction } from "@/shared/ui/providers/theme/types/theme-action.enum";
import { Typo } from "@/shared/ui/typo";
import { Switch } from "@/shared/ui/switch";

export const ThemeSwitch = () => {
  const { theme } = useTheme();
  const dispatchTheme = useDispatchTheme();

  const toggleTheme = () => {
    const newTheme = theme === E_Theme.Light ? E_Theme.Dark : E_Theme.Light;
    dispatchTheme({ type: E_ThemeAction.Set, payload: newTheme }); // ✅ enum
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 p-2 rounded-lg bg-bg-secondary hover:bg-bg-primary transition"
      aria-label={`Переключить тему: ${theme === E_Theme.Light ? "Темная" : "Светлая"}`}
    >
      {theme === E_Theme.Light ? <DarkThemeIcon /> : <LightThemeIcon />}
      <span>{theme === E_Theme.Light ? "Темная" : "Светлая"}</span>
    </button>
  );
};
