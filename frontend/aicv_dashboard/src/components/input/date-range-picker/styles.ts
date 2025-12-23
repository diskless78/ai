import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import { inputTokens } from 'src/theme/styles/input-components';
import Column from 'src/components/common/column';

export const StyledDateRangePicker = styled(Box)<{
  ownerState: {
    fullWidth?: boolean;
    width?: string;
    colorType: 'normal' | 'error';
  };
}>(({ theme, ownerState: { fullWidth, width, colorType } }) => {
  const borderColorDefault = theme.palette.neutral[20];
  const borderColorError = theme.palette.orange[70];
  const borderColorFocus = theme.palette.blue[60];

  return {
    width: fullWidth ? '100%' : width || 'unset',
    backgroundColor: theme.palette.neutral[10],
    height: inputTokens.height.small,
    padding: inputTokens.padding.small,
    borderRadius: inputTokens.borderRadius,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    border: `${inputTokens.borderWidth} solid ${colorType === 'error' ? borderColorError : borderColorDefault}`,
    position: 'relative',
    transition: 'all 0.2s ease',

    '&:hover': {
      borderColor: colorType === 'error' ? borderColorError : borderColorFocus,
    },

    '&.Mui-focused': {
      borderWidth: inputTokens.borderWidth,
      borderColor: colorType === 'error' ? borderColorError : borderColorFocus,
      boxShadow: `0 0 0 ${inputTokens.outline.width} ${colorType === 'error'
        ? theme.palette.orange[10]
        : theme.palette.blue[10]
        }`,
      transition: 'box-shadow 0.3s ease, border-color 0.2s ease',
    },
  };
});

export const StyledPresetOption = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: `${pxToRem(8)} ${pxToRem(12)}`,
  borderRadius: pxToRem(6),
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',

  '&:hover': {
    backgroundColor: theme.palette.neutral[10],
  },
}));

export const StyledDateRangeDisplay = styled(Box)(({ theme }) => ({
  width: "fullWidth ? '100%' : width || 'unset'",
  borderTop: `1px solid ${theme.palette.neutral[20]}`,
  padding: pxToRem(12),
}));

export const StyledCalendarContainer = styled(Column)(({ theme }) => ({
  '& .MuiPickersCalendarHeader-label': {
    ...theme.typography.t2SemiBold,
    color: theme.palette.neutral[100],
  },
  '& .MuiDayCalendar-weekContainer': {
    'button[disabled]': {
      ...theme.typography.b3Regular,
      color: theme.palette.neutral[50],
    },
  },
  '& .MuiDayCalendar-header': {
    '& span': {
      ...theme.typography.t3SemiBold,
      color: theme.palette.neutral[100],
    },
  },
}));
