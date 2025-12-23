import { styled } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import type {
  BaseIconButtonSize,
  BaseIconButtonShape,
  BaseIconButtonVariant,
  BaseIconButtonColor,
} from './types';

export const StyledBaseIconButton = styled(IconButton)<{
  ownerState: {
    size?: BaseIconButtonSize;
    variant?: BaseIconButtonVariant;
    shape?: BaseIconButtonShape;
    color?: BaseIconButtonColor;
  };
}>(({ theme, ownerState: { size, variant, shape, color } }) => {
  const backgroundColor = {
    ...(variant === 'contained' &&
      color === 'red' && {
        backgroundColor: theme.palette.red[10],
      }),
    ...(variant === 'contained' &&
      color === 'grey' && {
        backgroundColor: theme.palette.neutral[20],
      }),
  };

  const borderRadius = {
    ...(shape === 'circle' && {
      borderRadius: '50%',
    }),
    ...(shape === 'square' && {
      borderRadius: pxToRem(8),
    }),
  };

  const width = {
    ...(size === 'small' && {
      width: pxToRem(28),
      height: pxToRem(28),
    }),
    ...(size === 'medium' && {
      width: pxToRem(36),
      height: pxToRem(36),
    }),
  };

  return {
    ...borderRadius,
    ...backgroundColor,
    ...width,
  };
});
