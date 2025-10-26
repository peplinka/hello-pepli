import React, { useReducer } from 'react';
import { SwitchContext } from '../context/Switch.context';
import { switchReducer } from '../reducer/Switch.reducer';

export const SwitchProvider = ({ children }) => {
  const [state, dispatch] = useReducer(switchReducer, {
    currOption: 'light', // ← значение по умолчанию
  });

  return (
    <SwitchContext.Provider value={{ state, dispatch }}>
      {children}
    </SwitchContext.Provider>
  );
};