import {createContext} from "react";


export type SwitchContextType = {
  state: { currOption: string };
  dispatch: React.Dispatch<{ type: string; payload: string }>;
};

// ✅ Создаём контекст с типом и значением по умолчанию = undefined
export const SwitchContext = createContext<SwitchContextType | undefined>(undefined);
