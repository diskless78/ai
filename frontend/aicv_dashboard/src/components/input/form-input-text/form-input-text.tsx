import { TextField, InputLabel, FormControl, Box } from '@mui/material';
import { Controller } from 'react-hook-form';
import FormError from 'src/components/common/form-error';
import { pxToRem } from 'src/theme/styles';
import { StyledFormInputText } from './styles';
import type { FormInputTextProps } from './types';

export default function FormInputText({
  name,
  label,
  required,
  control,
  type,
  inputProps,
  errors,
  messageError,
  autoComplete = 'off',
  placeholder,
  fullWidth,
  width = pxToRem(200),
}: FormInputTextProps) {
  const isTextarea = type === 'textarea';
  const isNumber = type === 'number';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isNumber) {
      const isAlphanumeric = /^[a-zA-Z0-9]$/.test(e.key);
      if (
        (!isAlphanumeric && e.key !== 'Backspace') ||
        e.key.toLowerCase() === 'e'
      ) {
        e.preventDefault();
      }
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (isNumber) {
      const input = e.target as HTMLInputElement;
      input.value = input.value.replace(/[^a-zA-Z0-9]/g, '');
    }
  };

  return (
    <StyledFormInputText
      ownerState={{
        fullWidth,
        width,
        colorType: errors?.[name]?.message ? 'error' : 'normal',
      }}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormControl fullWidth={fullWidth}>
            {label && (
              <InputLabel shrink htmlFor={name}>
                {label}
                {required && <Box component='span'> *</Box>}
              </InputLabel>
            )}

            <TextField
              {...field}
              id={name}
              fullWidth={fullWidth}
              slotProps={{ input: inputProps }}
              type={type}
              autoComplete={autoComplete}
              placeholder={placeholder}
              multiline={isTextarea}
              rows={isTextarea ? 4 : undefined}
              onKeyDown={handleKeyDown}
              onInput={handleInput}
            />

            {errors?.[name]?.message && (
              <FormError message={errors[name].message?.toString()} />
            )}
            {messageError && <FormError message={messageError} />}
          </FormControl>
        )}
      />
    </StyledFormInputText>
  );
}
