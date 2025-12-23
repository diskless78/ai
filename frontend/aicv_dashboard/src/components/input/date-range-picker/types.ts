import type { InputLabelProps, SxProps, Theme } from '@mui/material';
import type { FieldErrors, ControllerRenderProps } from 'react-hook-form';
import type { ETimeFilterType } from 'src/models/common/models.enum';

export type DateRangeValue = {
  startDate: string | null;
  endDate: string | null;
  timeFilterType: ETimeFilterType;
};

export type DateRangePreset = {
  id: ETimeFilterType;
  label: string;
};

export type DateRangePickerProps = {
  name?: string;
  label?: string;
  fullWidth?: boolean;
  inputLabelProps?: Partial<InputLabelProps> | undefined;
  errors?: FieldErrors;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  width?: string;
  field?: ControllerRenderProps<any, string>;
  value?: DateRangeValue;
  onChangeValue?: (value: DateRangeValue) => void;
  sx?: SxProps<Theme>;
};
