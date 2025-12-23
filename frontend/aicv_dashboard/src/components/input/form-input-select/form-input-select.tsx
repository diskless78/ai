import { InputLabel, FormControl } from '@mui/material';
import { Controller } from 'react-hook-form';
import FormError from 'src/components/common/form-error';
import InputSelect from '../input-select/input-select';
import { StyledFormInputSelect } from './styles';
import type { FormInputSelectProps } from './types';

export default function FormInputSelect({
  name,
  control,
  label,
  required,
  fullWidth,
  width,
  list,
  errors,
  onChangeValue,
}: FormInputSelectProps) {
  return (
    <StyledFormInputSelect>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormControl fullWidth={fullWidth}>
            <InputLabel shrink htmlFor={name}>
              {label}
              {required && <span> *</span>}
            </InputLabel>
            <InputSelect
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
    </StyledFormInputSelect>
  );
}
