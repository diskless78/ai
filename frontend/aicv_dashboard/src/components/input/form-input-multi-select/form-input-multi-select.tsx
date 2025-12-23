import { InputLabel, FormControl } from '@mui/material';
import { Controller } from 'react-hook-form';
import FormError from 'src/components/common/form-error';
import { StyledFormInputMultiSelect } from './styles';
import type { FormInputMultiSelectProps } from './types';
import InputMultiSelect from '../input-multi-select/input-multi-select';

export default function FormInputMultiSelect({
  name,
  control,
  label,
  required,
  fullWidth,
  width,
  list,
  errors,
  onChangeValue,
}: FormInputMultiSelectProps) {
  return (
    <StyledFormInputMultiSelect>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormControl fullWidth={fullWidth}>
            <InputLabel shrink htmlFor={name}>
              {label}
              {required && <span> *</span>}
            </InputLabel>
            <InputMultiSelect
              name={name}
              width={width}
              list={list}
              onChangeValue={onChangeValue}
              field={field}
              fullWidth={fullWidth}
              errors={errors}
            />
            {errors?.[name]?.message && (
              <FormError message={errors?.[name]?.message?.toString()} />
            )}
          </FormControl>
        )}
      />
    </StyledFormInputMultiSelect>
  );
}
