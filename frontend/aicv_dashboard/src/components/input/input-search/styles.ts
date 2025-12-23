import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import {
  focusOutlineMixin,
  inputTokens,
} from 'src/theme/styles/input-components';

export const StyledInputSearch = styled(TextField)<{
  ownerState: {
    fullWidth?: boolean;
    width?: string;
  };
}>(({ theme, ownerState: { fullWidth, width } }) => {
  const borderColorDefault = theme.palette.neutral[20];
  const borderColorFocus = theme.palette.blue[60];

  return {
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

      // Focus outline effect
      ...focusOutlineMixin(theme, 'normal'),

      '&.Mui-focused': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: borderColorFocus,
          borderWidth: inputTokens.borderWidth,
        },
      },

      '& .MuiInputBase-input': {
        ...theme.typography.b3Regular,
        boxSizing: 'border-box',
        padding: inputTokens.padding.large,
        '&.MuiInputBase-inputAdornedStart': {
          paddingLeft: 0,
        },
        '&.MuiInputBase-inputAdornedEnd': {
          paddingRight: 0,
        },
      },

      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: borderColorDefault,
        borderRadius: inputTokens.borderRadius,
      },

      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: borderColorFocus,
      },
    },
  };
});
