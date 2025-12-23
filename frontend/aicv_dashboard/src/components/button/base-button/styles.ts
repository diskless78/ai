import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import type {
  BaseButtonSize,
  BaseButtonMode,
  BaseButtonColor,
  BaseButtonVariant,
} from './types';
import { baseIconClasses } from 'src/components/svg/svg-color';

export const StyledBaseButton = styled(Button)<{
  ownerState: {
    variant?: BaseButtonVariant;
    color?: BaseButtonColor;
    size?: BaseButtonSize;
    disabled?: boolean;
    width?: string | number;
    mode?: BaseButtonMode;
  };
}>(({ theme, ownerState: { variant, color, size, disabled, width, mode } }) => {
  const backgroundColor = {
    ...(variant === 'contained' &&
      color === 'primary' && {
        background:
          'linear-gradient(180deg, #9333EA 0%, #7D16E0 100%);!important',
      }),
    ...(variant === 'contained' &&
      color === 'secondary' && {
        background: theme.palette.neutral[20],
      }),
    ...(variant === 'contained' &&
      color === 'white' && {
        background: theme.palette.neutral[0],
      }),
    ...(variant === 'contained' &&
      color === 'red' && {
        backgroundColor: theme.palette.red[60],
      }),
    ...(variant === 'outlined' &&
      mode === 'dark' &&
      color === 'primary' && {
        backgroundColor: `#006AFF33!important`,
      }),
    ...(variant === 'outlined' &&
      mode === 'light' &&
      color === 'primary' && {
        backgroundColor: `white!important`,
      }),
  };

  const height = {
    ...(size === 'small' && {
      height: pxToRem(28),
    }),
    ...(size === 'medium' && {
      height: pxToRem(36),
    }),
    ...(size === 'large' && {
      height: pxToRem(46),
    }),
  };

  const opacity = {
    ...(disabled && {
      opacity: 0.5,
    }),
  };

  const border = {
    ...(variant === 'contained' && {
      border: 'none',
    }),
    ...(variant === 'outlined' &&
      mode === 'dark' &&
      color === 'primary' && {
        borderColor: theme.palette.pink[800],
        '&:hover': {
          borderColor: theme.palette.pink[600],
        },
      }),
    ...(variant === 'outlined' &&
      mode === 'light' &&
      color === 'primary' && {
        borderColor: '#E4E4E4',
        '&:hover': {
          borderColor: theme.palette.blue[400],
        },
      }),
  };

  const borderRadius = {
    ...(size === 'small' && {
      borderRadius: pxToRem(8),
    }),
    ...(size === 'medium' && {
      borderRadius: pxToRem(10),
    }),
    ...(size === 'large' && {
      borderRadius: pxToRem(12),
    }),
  };

  const textColor = {
    ...(variant === 'contained' &&
      color === 'primary' && {
        color: 'white',
      }),
    ...(variant === 'contained' &&
      color === 'secondary' && {
        color: theme.palette.neutral[100],
      }),
    ...(variant === 'contained' &&
      color === 'white' && {
        color: theme.palette.purple[80],
      }),
    ...(variant === 'contained' &&
      color === 'red' && {
        color: 'white',
      }),
    ...(variant === 'outlined' &&
      mode === 'light' && {
        color: '#6554AE',
      }),
    ...(variant === 'outlined' &&
      mode === 'dark' && {
        color: 'white',
      }),
  };

  return {
    position: 'relative',
    width,
    alignItems: 'center',
    textTransform: 'none',
    ...borderRadius,
    ...backgroundColor,
    ...height,
    ...opacity,
    ...border,

    '&.Mui-disabled': {
      color: 'inherit',
    },
    '& .MuiTypography-root': {
      ...(size === 'small' && theme.typography.t4SemiBold),
      ...(size === 'medium' && theme.typography.t3SemiBold),
      ...(size === 'large' && theme.typography.t1SemiBold),
      ...textColor,
    },
  };
});

export const StyledSpinner = styled(Box)<{
  ownerState: {
    color?: BaseButtonColor;
  };
}>(({ theme, ownerState: { color } }) => {
  return {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'spin 1s linear infinite',
    '@keyframes spin': {
      '0%': {
        transform: 'translate(-50%, -50%) rotate(0deg)',
      },
      '100%': {
        transform: 'translate(-50%, -50%) rotate(360deg)',
      },
    },
    [`& .${baseIconClasses.root}`]: {
      color:
        color === 'primary'
          ? theme.palette.neutral[0]
          : color === 'secondary'
            ? theme.palette.neutral[80]
            : theme.palette.purple[80],
    },
  };
});

export const StyledButtonContent = styled('div')<{ $isLoading?: boolean }>(
  ({ $isLoading }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: $isLoading ? 0 : 1,
    visibility: $isLoading ? 'hidden' : 'visible',
  })
);
