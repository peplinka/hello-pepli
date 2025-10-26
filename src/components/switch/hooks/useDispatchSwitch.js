import {useContext} from "react";
import {DispatchSwitchContext} from "@/components/switch/context/DispatchSwitch.context";

export const useDispatchSwitch = () => {
    return useContext(DispatchSwitchContext);
}