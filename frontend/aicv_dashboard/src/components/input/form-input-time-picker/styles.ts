import type { Theme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { pxToRem } from 'src/theme/styles';

export const StyledFormInputTimePicker = styled(Box)(({
  theme,
}: {
  theme: Theme;
}) => {
  const defaultStyle = {};

  return {
    width: '100%',
    '& .MuiFormControl-root': {
      gap: pxToRem(2),
      '& .MuiFormLabel-root': {
        padding: `${pxToRem(2)} ${pxToRem(4)}`,
        position: 'relative',
        transform: 'none',
        ...theme.typography.body2,
        color: theme.palette.neutral[100],
      },
    },

    ...defaultStyle,
  };
});
