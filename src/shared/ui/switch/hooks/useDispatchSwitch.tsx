import { useContext } from "react";
import { DispatchSwitchContext } from "@/shared/ui/switch/context/DispatchSwitch.context";

export const useDispatchSwitch = () => {
  return useContext(DispatchSwitchContext);
};
