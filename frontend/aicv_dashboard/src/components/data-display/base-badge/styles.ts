import { Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import { pxToRem } from 'src/theme/styles';

export const StyledBaseBadge = styled(Badge)(() => {
  const defaultStyle = {};

  return {
    '& .MuiBadge-badge': {
      minWidth: pxToRem(24),
      height: pxToRem(24),
      px: pxToRem(6),
      borderRadius: pxToRem(12),
      bgcolor: '#F5F5F7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    ...defaultStyle,
  };
});
