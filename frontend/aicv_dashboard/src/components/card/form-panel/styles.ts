import { styled, Box } from '@mui/material';
import { pxToRem } from 'src/theme/styles';

export const StyledFormPanel = styled(Box)<{
  ownerState: { variant: 'default' | 'compact'; hasError?: boolean };
}>(({ theme, ownerState }) => ({
  width: '100%',
  padding: `${pxToRem(20)} ${pxToRem(20)} 0 ${pxToRem(20)}`,
  backgroundColor: theme.palette.neutral[0],
  borderRadius: pxToRem(20),
  border: `1px solid ${ownerState.hasError ? theme.palette.orange[70] : theme.palette.neutral[30]}`,
  overflow: 'hidden',
  boxShadow: theme.customShadows.card0Light,
  '& .MuiFormPanelHeader-root': {
    gap: pxToRem(12),
  },
  '& .MuiFormPanelContent-root': {
    paddingTop: pxToRem(24),
    paddingBottom: pxToRem(32),
    display: 'flex',
    flexDirection: 'column',
  },
}));
