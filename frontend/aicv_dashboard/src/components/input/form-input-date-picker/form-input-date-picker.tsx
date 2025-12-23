import { useTheme, InputLabel, FormControl } from '@mui/material';
import { Controller } from 'react-hook-form';
import FormError from 'src/components/common/form-error';
import { StyledFormInputDatePicker } from './styles';
import InputDatePicker from '../input-date-picker/input-date-picker';
import type { FormInputDatePickerProps } from './types';

export default function FormInputDatePicker({
  name,
  control,
  label,
  required,
  size,
  fullWidth,
  errors,
}: FormInputDatePickerProps) {
  const theme = useTheme();

  return (
    <StyledFormInputDatePicker theme={theme} ownerState={{ fullWidth }}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormControl fullWidth={fullWidth}>
            <InputLabel shrink htmlFor={label}>
              {required ? `${label} *` : label}
            </InputLabel>
            <InputDatePicker
              field={field}
              value={field.value}
              size={size}
              fullWidth={fullWidth}
            />
            {errors?.[name]?.message && (
              <FormError message={errors?.[name]?.message?.toString()} />
            )}
          </FormControl>
        )}
      />
    </StyledFormInputDatePicker>
  );
}
