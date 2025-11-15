import React, { useReducer } from 'react';
import { SwitchContext } from '../context/Switch.context';
import { switchReducer } from '../reducer/Switch.reducer';
// ❗ Убедитесь, что типы State и DispatchAction определены в Switch.reducer.ts или отдельно

// Опционально: если типы State и DispatchAction не экспортируются из редюсера
// interface SwitchState {
//   currOption: string; // или конкретные значения, например: 'light' | 'dark'
// }

// type SwitchAction = { type: 'set'; payload: string } | { type: 'reset' }; // Пример

interface SwitchProviderProps {
  children: React.ReactNode;
}

export const SwitchProvider: React.FC<SwitchProviderProps> = ({ children }) => {
  // Если типы State и DispatchAction определены в Switch.reducer.ts и экспортированы:
  // type StateType = ReturnType<typeof switchReducer>; // Это может не сработать, если начальное состояние не строго типизировано
  // Лучше определить явно или импортировать

  // Предположим, что Switch.reducer.ts экспортирует типы:
  // import { SwitchState, SwitchAction } from '../reducer/Switch.reducer';
  // Тогда:
  // const [state, dispatch] = useReducer<React.Reducer<SwitchState, SwitchAction>>(switchReducer, {
  //   currOption: 'light',
  // });

  // Если типы не экспортируются или вы используете простые типы:
  const [state, dispatch] = useReducer(switchReducer, {
    currOption: 'light', // ← значение по умолчанию
  });

  return (
    <SwitchContext.Provider value={{ state, dispatch }}>
      {children}
    </SwitchContext.Provider>
  );
};