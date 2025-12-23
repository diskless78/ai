import { styled } from '@mui/material/styles';
import { ButtonBase } from '@mui/material';
import { pxToRem } from 'src/theme/styles';

export const StyledButtonText = styled(ButtonBase)(() => {
  const defaultStyle = {};

  return {
    width: 'fit-content',
    gap: pxToRem(8),
    alignItems: 'end',
    padding: `${pxToRem(4)} ${pxToRem(4)} ${pxToRem(4)} ${pxToRem(4)}`,
    borderRadius: pxToRem(8),
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },

    ...defaultStyle,
  };
});
