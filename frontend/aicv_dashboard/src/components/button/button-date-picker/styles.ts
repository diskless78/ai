import { styled } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { pxToRem } from 'src/theme/styles';
import type { ButtonDatePickerType } from './types';

export const StyledButtonDatePicker = styled(DatePicker)(({
  ownerState: { type },
}: {
  ownerState: {
    type: ButtonDatePickerType;
  };
}) => {
  const styledButton = {
    width: pxToRem(24),
    height: pxToRem(24),
    padding: 0,
    '& .MuiInputBase-root': {
      '&.Mui-focused': {
        '& .icon': {
          opacity: 1,
        },
      },
      '& .MuiButtonBase-root': {
        width: pxToRem(24),
        height: pxToRem(24),
      },
      '& .MuiInputBase-input': {
        display: 'none',
        padding: 0,
      },
      '& fieldset': {
        display: 'none',
      },
      '& .MuiInputAdornment-root': {
        display: 'flex',
      },
      '& .icon': {
        opacity: 0.5,
        '&:hover': {
          opacity: 1,
        },
      },
    },
  };
  return {
    ...(type === 'button' && {
      ...styledButton,
    }),
  };
});
