import * as cls from "./Typo.module.css";
import clsx from "clsx";

export const Typo = (props) => {
  const Computed = props.tag || "p";
  const as = props.as || Computed;

  return (
    <Computed
      className={clsx(cls[as], props.tag ? cls[props.align] : cls.start)}
    >
      {props.children}
    </Computed>
  );
};
