import { useContext } from "react";
import { DispatchThemeContext } from "../context/DispatchTheme.context";

export const useDispatchTheme = () => {
  return useContext(DispatchThemeContext);
};
