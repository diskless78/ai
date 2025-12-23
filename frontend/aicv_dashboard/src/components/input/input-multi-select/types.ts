import type { InputProps, InputLabelProps } from '@mui/material';
import type { FieldErrors, ControllerRenderProps } from 'react-hook-form';
import type { IValue } from 'src/models/common/models.type';

export type InputMultiSelectProps = {
  name?: string;
  label?: string;
  fullWidth?: boolean;
  list: IValue[];
  inputLabelProps?: Partial<InputLabelProps> | undefined;
  type?: React.InputHTMLAttributes<unknown>['type'];
  inputProps?: Partial<InputProps>;
  errors?: FieldErrors;
  onBlur?: () => void;
  onFocus?: () => void;
  autoComplete?: string;
  placeholder?: string;
  width?: string;
  field?: ControllerRenderProps<any, string>;
  value?: string[];
  onChangeValue?: (value: string[]) => void;
  showAllOption?: boolean;
  allOptionLabel?: string;
};
