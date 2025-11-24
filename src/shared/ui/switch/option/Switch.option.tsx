import React from 'react';
import clsx from "clsx";
import { useSwitch } from '../hooks/useSwitch';

// Определяем тип пропсов
interface SwitchOptionProps {
  name: string; // или number, в зависимости от того, что вы используете
  onClick?: () => void; // onClick может быть необязательным
  className?: string; // className тоже может быть необязательным
  children: React.ReactNode; // children — то, что рендерится внутри кнопки
}

export const SwitchOption: React.FC<SwitchOptionProps> = (props) => {
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