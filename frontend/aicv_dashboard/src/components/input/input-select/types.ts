import type { InputLabelProps, SxProps, Theme } from '@mui/material';
import type { FieldErrors, ControllerRenderProps } from 'react-hook-form';
import type { IValue } from 'src/models/common/models.type';

export type InputSelectProps = {
  name?: string;
  value?: string | null;
  onChangeValue?: (value: string) => void;
  width?: string;
  list: IValue[];
  field?: ControllerRenderProps<any, string>;
  fullWidth?: boolean;
  errors?: FieldErrors;
  placeholder?: string;
  startIcon?: React.ReactNode;
  sx?: SxProps<Theme>;
  showAllOption?: boolean;
  allOptionLabel?: string;

  // not used
  label?: string;
  inputLabelProps?: Partial<InputLabelProps> | undefined;
  type?: React.InputHTMLAttributes<unknown>['type'];
  onBlur?: () => void;
  onFocus?: () => void;
  autoComplete?: string;
};
