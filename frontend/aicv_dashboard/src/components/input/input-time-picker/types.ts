import type { ControllerRenderProps } from 'react-hook-form';

export type TimePickerSize = 'small' | 'medium';

export type InputTimePickerProps = {
  value?: string | null;
  onChangeValue?: (string: string | null) => void;
  size?: TimePickerSize;
  field?: ControllerRenderProps<any, string>;
  width?: string | number;
  fullWidth?: boolean;
};
