import type { Control, FieldErrors } from 'react-hook-form';
import type { InputSelectProps } from '../input-select/types';

export type FormInputSelectProps = InputSelectProps & {
  name: string;
  control: Control<any, object>;
  required?: boolean;
  label?: string;
  errors?: FieldErrors;
};
