import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { pxToRem } from 'src/theme/styles';

export const StyledBaseArrcordion = styled(Box)(({ theme }) => {
  const defaultStyle = {};

  return {
    backgroundColor: theme.palette.neutral[0],
    border: `1px solid ${theme.palette.neutral[20]}`,
    borderRadius: pxToRem(12),
    boxShadow: theme.customShadows.dropShadow,
    paddingTop: pxToRem(16),
    paddingInline: pxToRem(16),
    display: 'flex',
    flexDirection: 'column',

    ...defaultStyle,
  };
});
