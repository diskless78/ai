import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { pxToRem } from 'src/theme/styles';
import {
  borderStateMixin,
  focusOutlineMixin,
  inputTokens,
} from 'src/theme/styles/input-components';

export const StyledFormInputText = styled(Box)<{
  ownerState: {
    fullWidth?: boolean;
    width?: string;
    colorType: 'normal' | 'error';
  };
}>(({ theme, ownerState: { fullWidth, width, colorType } }) => {
  const borderColorError = theme.palette.orange[70];
  const labelColor = theme.palette.neutral[100];

  return {
    width: '100%',

    '& .MuiFormControl-root': {
      gap: pxToRem(2),

      '& .MuiFormLabel-root': {
        padding: `${pxToRem(2)} ${pxToRem(4)}`,
        position: 'relative',
        transform: 'none',
        ...theme.typography.t4SemiBold,
        color: labelColor,
        '& > span': {
          color: borderColorError,
        },
      },

      '& .MuiInputBase-root': {
        width: fullWidth ? '100%' : width || 'unset',
        height: inputTokens.height.medium,
        backgroundColor: theme.palette.neutral[10],
        borderRadius: inputTokens.borderRadius,
        position: 'relative',

        '&.MuiInputBase-adornedStart': {
          paddingLeft: pxToRem(12),
          display: 'flex',
          alignItem: 'center',
        },
        '&.MuiInputBase-adornedEnd': {
          paddingRight: pxToRem(24),
        },
        '& > input': {
          display: 'flex',
          alignItem: 'center',
          ...theme.typography.b3Regular,

          '&::placeholder': {
            color: theme.palette.neutral[60],
            opacity: 1,
          },
        },

        // Focus outline effect
        ...focusOutlineMixin(theme, colorType),

        ...borderStateMixin(theme, colorType),

        '& .MuiInputBase-input': {
          padding: inputTokens.padding.large,
          '&.MuiInputBase-inputAdornedStart': {
            paddingLeft: 0,
          },
          '&.MuiInputBase-inputAdornedEnd': {
            paddingRight: 0,
          },
          '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active':
            {
              WebkitTextFillColor: labelColor,
              transition: 'background-color 5000s ease-in-out 0s',
              WebkitBoxShadow: `0 0 0 30px ${theme.palette.neutral[10]} inset !important`,
            },
        },
      },
    },
  };
});
