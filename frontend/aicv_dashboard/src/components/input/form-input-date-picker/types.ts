import type { Control, FieldErrors } from 'react-hook-form';
import type { DatePickerSize } from '../input-date-picker/types';

export type FormInputDatePickerProps = {
  name: string;
  control: Control<any, object>;
  required?: boolean;
  label: string;
  size?: DatePickerSize;
  fullWidth?: boolean;
  errors?: FieldErrors;
};
