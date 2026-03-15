// src/components/switch/reducer/Switch.reducer.ts (или shared/lib/switch/reducer/)

// Определяем тип состояния
export type SwitchState = {
  currOption: string; // или конкретные значения, например: 'light' | 'dark' | 'blue'
};

// Определяем типы действий
export type SwitchAction =
  | { type: "set"; payload: string } // payload должен соответствовать типу currOption
  | { type: "reset" }; // добавьте другие действия, если они есть

// Редюсер с типизацией
export const switchReducer = (
  state: SwitchState,
  action: SwitchAction,
): SwitchState => {
  switch (action.type) {
    case "set":
      return {
        ...state,
        currOption: action.payload, // ✅ payload теперь типизирован как string
      };
    case "reset":
      return {
        ...state,
        currOption: "light", // или другое начальное значение
      };
    default:
      // Проверка на случай добавления новых Action в будущем
      const exhaustiveCheck: never = action;
      return state;
  }
};
