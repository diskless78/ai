import MuiAlert from '@mui/material/Alert';
import { type Theme, styled } from '@mui/material/styles';
import { pxToRem } from 'src/theme/styles';

export const StyledToastCaution = styled(MuiAlert)(({
  theme,
  // ownerState: { },
}: {
  theme: Theme;
  // ownerState: { };
}) => {
  const defaultStyle = {};

  return {
    color: 'white',
    width: pxToRem(400),
    backgroundColor: '#FFFFFF',
    padding: `${pxToRem(11.5)} ${pxToRem(16)}`,
    ...theme.effect.primary,
    '& .MuiAlert-message': {
      padding: 0,
      width: '100%',
    },
    '& .MuiAlert-icon': {
      display: 'none',
      marginRight: pxToRem(16),
    },
    '& .MuiAlert-action': {
      display: 'none',
    },

    ...defaultStyle,
  };
});
