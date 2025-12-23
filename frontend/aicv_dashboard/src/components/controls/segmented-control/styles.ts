import Box from '@mui/material/Box';
import { type Theme, styled } from '@mui/material/styles';
import { pxToRem } from 'src/theme/styles';
import type { SegmentedControlSize } from './types';

export const StyledSegmentedControl = styled(Box)(({
  theme,
  ownerState: { size, segmentedWidth },
}: {
  theme: Theme;
  ownerState: {
    size: SegmentedControlSize;
    segmentedWidth?: string | number;
  };
}) => {
  const controlHeight = {
    ...(size === 'small' && {
      height: pxToRem(32),
    }),

    ...(size === 'medium' && {
      height: pxToRem(40),
    }),
  };

  const segmentHeight = {
    ...(size === 'small' && {
      height: pxToRem(28),
    }),

    ...(size === 'medium' && {
      height: pxToRem(36),
    }),
  };

  return {
    display: 'flex',
    width: segmentedWidth ? 'auto' : '100%',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.background.default,
    borderRadius: pxToRem(12),
    padding: pxToRem(2),
    position: 'relative',
    ...controlHeight,
    '& .segment': {
      width: segmentedWidth || '100%',
      position: 'relative',
      textAlign: 'center',
      zIndex: 1,
      ...segmentHeight,
      '& input': {
        opacity: 0,
        position: 'absolute',
      },
      '& label': {
        height: '100%',
        cursor: 'pointer',
        transition: 'color 0.5s ease',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    '&:before': {
      content: '""',
      backgroundColor: theme.palette.background.default,
      borderRadius: pxToRem(10),
      width: 'var(--highlight-width)',
      transform: 'translateX(var(--highlight-x-pos))',
      position: 'absolute',
      top: 2,
      bottom: 2,
      left: 0,
      right: 0,
      zIndex: 0,
      border: '1px solid',
      borderColor: theme.palette.grey[200],
      ...segmentHeight,
    },
    '&.ready::before': {
      transition: 'transform 0.3s ease, width 0.3s ease',
    },
  };
});
