import { createContext } from 'react';
import { SwitchState, SwitchAction } from '../reducer/Switch.reducer'; // ✅ Импортируем SwitchAction

// Определяем тип, который будет у значения контекста
type SwitchContextType = {
  state: SwitchState;
  dispatch: React.Dispatch<SwitchAction>; // ✅ Тип dispatch соответствует SwitchAction
};

// Создаём контекст с типом SwitchContextType
// Используем null как начальное значение, но в SwitchProvider передаём реальное значение
export const SwitchContext = createContext<SwitchContextType | null>(null);
