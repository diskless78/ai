import type { InputProps } from '@mui/material';
import type { Control, FieldErrors } from 'react-hook-form';

export type InputTextSize = 'small' | 'medium';

export type FormInputTextProps = {
  name: string;
  label?: string;
  required?: boolean;
  control: Control<any, object>;
  fullWidth?: boolean;
  type?: React.InputHTMLAttributes<unknown>['type'];
  inputProps?: Partial<InputProps>;
  errors?: FieldErrors;
  messageError?: string;
  autoComplete?: string;
  placeholder?: string;
  width?: string;
  rows?: number;
};
