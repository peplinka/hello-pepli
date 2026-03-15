import { SwitchProvider } from "../provider/Switch.provider";
import React from "react"; //

export const SwitchBase: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <SwitchProvider>
      <div className="switch-base">{children}</div>
    </SwitchProvider>
  );
};
