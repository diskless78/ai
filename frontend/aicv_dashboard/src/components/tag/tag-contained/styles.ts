import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { pxToRem } from 'src/theme/styles';
import type {
  TagContainedTextColor,
  TagContainedBackgroundColor,
} from './types';

export const StyledTagContained = styled(Box)<{
  ownerState: {
    bgColor: TagContainedBackgroundColor;
    txtColor: TagContainedTextColor;
    alignSelf: 'start' | 'center' | 'end';
    hasBorder: boolean;
  };
}>(({ theme, ownerState: { bgColor, txtColor, alignSelf, hasBorder } }) => {
  const textColor = {
    ...(txtColor === 'success' && {
      color: theme.palette.green[70],
    }),
    ...(txtColor === 'warning' && {
      color: theme.palette.orange[70],
    }),
    ...(txtColor === 'error' && {
      color: theme.palette.red[70],
    }),
    ...(txtColor === 'info' && {
      color: theme.palette.blue[70],
    }),
    ...(txtColor === 'grey' && {
      color: theme.palette.neutral[100],
    }),
  };

  const backgroundColor = {
    ...(bgColor === 'inherit' &&
      txtColor === 'success' && {
        backgroundColor: theme.palette.green[10],
      }),
    ...(bgColor === 'inherit' &&
      txtColor === 'warning' && {
        backgroundColor: theme.palette.yellow[10],
      }),
    ...(bgColor === 'inherit' &&
      txtColor === 'error' && {
        backgroundColor: theme.palette.red[10],
      }),
    ...(bgColor === 'inherit' &&
      txtColor === 'info' && {
        backgroundColor: theme.palette.blue[10],
      }),
    ...(bgColor === 'inherit' &&
      txtColor === 'grey' && {
        backgroundColor: theme.palette.grey[10],
      }),
    ...(bgColor === 'grey' && {
      backgroundColor: theme.palette.grey[10],
    }),
  };
  const borderColor = {
    ...(bgColor === 'inherit' &&
      txtColor === 'success' && {
        borderColor: theme.palette.green[20],
      }),
    ...(bgColor === 'inherit' &&
      txtColor === 'warning' && {
        borderColor: theme.palette.orange[20],
      }),
    ...(bgColor === 'inherit' &&
      txtColor === 'error' && {
        borderColor: theme.palette.red[20],
      }),
    ...(bgColor === 'inherit' &&
      txtColor === 'info' && {
        borderColor: theme.palette.blue[20],
      }),
    ...(bgColor === 'inherit' &&
      txtColor === 'grey' && {
        borderColor: theme.palette.grey[20],
      }),
    ...(bgColor === 'grey' && {
      borderColor: theme.palette.grey[20],
    }),
  };

  return {
    padding: `${pxToRem(6)} ${pxToRem(10)}`,
    borderRadius: pxToRem(10),
    display: 'inline-flex',
    gap: pxToRem(6),
    alignSelf,
    border: hasBorder ? `1px solid` : 'none',
    ...borderColor,

    ...backgroundColor,
    '& .MuiTypography-root': {
      ...textColor,
    },
  };
});
