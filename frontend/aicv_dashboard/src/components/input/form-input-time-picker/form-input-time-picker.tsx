import { InputLabel, FormControl } from '@mui/material';
import { Controller } from 'react-hook-form';
import FormError from 'src/components/common/form-error';
import type { FormInputTimePickerProps } from './types';
import { StyledFormInputTimePicker } from './styles';
import InputTimePicker from '../input-time-picker/input-time-picker';

export default function FormInputTimePicker({
  name,
  control,
  label,
  required,
  size,
  width,
  fullWidth,
  errors,
}: FormInputTimePickerProps) {
  return (
    <StyledFormInputTimePicker>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormControl>
            <InputLabel shrink htmlFor={label}>
              {required ? `${label} *` : label}
            </InputLabel>
            <InputTimePicker
              field={field}
              value={field.value}
              size={size}
              width={width}
              fullWidth={fullWidth}
            />
            {errors?.[name]?.message && (
              <FormError message={errors?.[name]?.message?.toString()} />
            )}
          </FormControl>
        )}
      />
    </StyledFormInputTimePicker>
  );
}
