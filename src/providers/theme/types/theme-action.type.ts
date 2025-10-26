import { T_ActionMap } from "@/types/action-map.type";
import { T_ThemePayload } from "./theme-payload.type";

export type T_ThemeAction = T_ActionMap<T_ThemePayload>[keyof T_ActionMap<T_ThemePayload>];