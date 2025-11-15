import { SwitchBase } from './base/Switch.base';
import { SwitchOption } from './option/Switch.option';

export { SwitchBase, SwitchOption };

// Экспортируем как объект для удобства (опционально)
export const Switch = {
  Base: SwitchBase,
  Option: SwitchOption,
};