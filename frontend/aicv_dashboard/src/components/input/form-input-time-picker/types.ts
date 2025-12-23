import type { Control, FieldErrors } from 'react-hook-form';
import type { TimePickerSize } from '../input-time-picker/types';

export type FormInputTimePickerProps = {
  name: string;
  control: Control<any, object>;
  required?: boolean;
  label: string;
  size?: TimePickerSize;
  width?: string | number | undefined;
  fullWidth?: boolean;
  errors?: FieldErrors;
};
