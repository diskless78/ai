import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { pxToRem } from 'src/theme/styles';

export const StyledFormInputSelect = styled(Box)(({ theme }) => {
  const defaultStyle = {};

  return {
    width: '100%',

    '& .MuiFormControl-root': {
      gap: pxToRem(2),

      '& .MuiFormLabel-root': {
        padding: `${pxToRem(2)} ${pxToRem(4)}`,
        position: 'relative',
        transform: 'none',
        ...theme.typography.t4SemiBold,
        color: theme.palette.neutral[100],
        '& > span': {
          color: theme.palette.orange[70],
        },
      },
    },

    ...defaultStyle,
  };
});
