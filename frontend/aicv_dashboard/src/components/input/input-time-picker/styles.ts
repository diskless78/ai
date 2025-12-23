import { type Theme, styled } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import { pxToRem } from 'src/theme/styles';
import type { TimePickerSize } from './types';

export const StyledTimePicker = styled(TimePicker)(({
  theme,
  ownerState: { size, width, fullWidth },
}: {
  theme: Theme;
  ownerState: {
    size: TimePickerSize;
    width: string | number;
    fullWidth?: boolean;
  };
}) => {
  const height = {
    ...(size === 'small' && {
      height: pxToRem(36),
    }),
    ...(size === 'medium' && {
      height: pxToRem(50),
    }),
  };

  const backgroundColor = {
    ...(size === 'small' && {
      backgroundColor: theme.palette.background.default,
    }),
    ...(size === 'medium' && {
      backgroundColor: theme.palette.background,
    }),
  };

  const borderRadius = {
    ...(size === 'small' && {
      borderRadius: pxToRem(12),
    }),
    ...(size === 'medium' && {
      borderRadius: pxToRem(60),
    }),
  };

  const padding = {
    ...(size === 'small' && {
      padding: `0 ${pxToRem(12)}`,
    }),
    ...(size === 'medium' && {
      padding: `0 ${pxToRem(16)}`,
    }),
  };

  const borderColor =
    theme.palette.mode === 'dark' ? theme.palette.grey[200] : '#0000001A';

  return {
    padding: 0,
    width: fullWidth ? '100%' : width || 'unset',
    cursor: 'default',
    ...height,
    '& .MuiInputBase-root': {
      pointerEvents: 'none',
      ...backgroundColor,
      ...borderRadius,
      ...padding,
      '& .MuiInputBase-input': {
        ...theme.typography.body1,
        color: theme.palette.neutral[100],
        WebkitTextFillColor: `${theme.palette.neutral[100]} !important`,
        padding: `2px 0 0 0`,
      },
      '& fieldset': {
        borderColor,
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor,
      },
      '&.Mui-error .MuiOutlinedInput-notchedOutline': {
        borderColor,
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.blue[400],
      },
    },
    '& .icon': {
      padding: pxToRem(8),
      marginRight: pxToRem(8),
      ...height,
    },
  };
});
