import type { Control, FieldErrors } from 'react-hook-form';
import type { InputMultiSelectProps } from '../input-multi-select/types';

export type FormInputMultiSelectProps = InputMultiSelectProps & {
  name: string;
  control: Control<any, object>;
  required?: boolean;
  label?: string;
  errors?: FieldErrors;
};
