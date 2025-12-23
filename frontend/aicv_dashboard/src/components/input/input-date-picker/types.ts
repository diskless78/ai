import type { ControllerRenderProps } from 'react-hook-form';

export type DatePickerSize = 'small' | 'medium';

export type InputDatePickerProps = {
  value?: Date | string | null;
  onChangeValue?: (value: string) => void;
  size?: DatePickerSize;
  field?: ControllerRenderProps<any, string>;
  width?: string | number;
  fullWidth?: boolean;
};
