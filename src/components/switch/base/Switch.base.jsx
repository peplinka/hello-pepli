import { SwitchProvider } from '../provider/Switch.provider';

export const SwitchBase = ({ children }) => {
  return (
    <SwitchProvider>
      <div className="switch-base">
        {children}
      </div>
    </SwitchProvider>
  );
};