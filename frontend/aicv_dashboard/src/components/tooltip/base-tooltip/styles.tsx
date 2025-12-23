import {
  IconButton,
  styled,
  Tooltip,
  tooltipClasses,
  type TooltipProps,
} from '@mui/material';
import { baseIconClasses } from 'src/components/svg/svg-color';
import { pxToRem } from 'src/theme/styles';
import type { BaseTooltipSize } from './types';

export const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => {
  return {
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      padding: '8px 12px',
      fontSize: pxToRem(14),
      borderRadius: '6px',
      maxWidth: 400,
      boxShadow: theme.shadows[8],
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: '#fff',
    },
  };
});

export const StyledTooltipIconButton = styled(IconButton)<{
  ownerState: {
    size?: BaseTooltipSize;
  };
}>(({ ownerState: { size } }) => {
  const height = {
    ...(size === 'small' && {
      height: pxToRem(20),
    }),
    ...(size === 'medium' && {
      height: pxToRem(24),
    }),
  };

  const width = {
    ...(size === 'small' && {
      width: pxToRem(20),
    }),
    ...(size === 'medium' && {
      width: pxToRem(24),
    }),
  };

  return {
    ...width,
    ...height,
    [`& .${baseIconClasses.root}`]: {
      cursor: 'pointer',
    },
  };
});
