import MuiAlert, { type AlertColor } from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import { pxToRem } from 'src/theme/styles';

export const StyledToast = styled(MuiAlert)<{
  ownerState: {
    color?: AlertColor;
  };
}>(({ theme, ownerState: { color } }) => {
  const defaultStyle = {};

  const backgroundColor = {
    ...(color === 'error' && {
      backgroundColor: theme.palette.red[60],
    }),
    ...(color === 'warning' && {
      backgroundColor: theme.palette.orange[60],
    }),
    ...(color === 'info' && {
      backgroundColor: theme.palette.blue[50],
    }),
    ...(color === 'success' && {
      backgroundColor: theme.palette.green[70],
    }),
  };

  return {
    color: theme.palette.neutral[0],
    width: pxToRem(320),
    backgroundColor: theme.palette.neutral[100],
    padding: `${pxToRem(10)} ${pxToRem(16)} ${pxToRem(12)} ${pxToRem(16)}`,
    ...theme.effect.primary,
    '& .MuiAlert-message': {
      padding: 0,
    },
    '& .MuiAlert-icon': {
      marginRight: pxToRem(16),
      '& > .MuiBox-root': {
        width: pxToRem(24),
        height: pxToRem(24),
        borderRadius: '50%',
        ...backgroundColor,
        '& .MuiBaseIcon-root': {
          color: theme.palette.neutral[0],
        },
      },
    },
    '& .MuiAlert-action': {
      display: 'none',
    },
    ...defaultStyle,
  };
});
