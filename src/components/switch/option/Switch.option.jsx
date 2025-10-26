import React from 'react';
import clsx from "clsx";
import { useSwitch } from '../hooks/useSwitch';

export const SwitchOption = (props) => {
  const { state, dispatch } = useSwitch(); // ✅ Деструктуризация объекта
  const { currOption } = state; // ✅ Теперь безопасно

  const setOption = () => {
    props.onClick && props.onClick();
    dispatch({ type: "set", payload: props.name });
  };

  return (
    <button
      className={clsx(
        props.className,
        currOption === props.name && 'active'
      )}
      onClick={setOption}
    >
      {props.children}
    </button>
  );
};