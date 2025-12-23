import { styled } from '@mui/material/styles';
import { Select } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import {
  focusOutlineMixin,
  borderStateMixin,
  inputTokens,
} from 'src/theme/styles/input-components';

export const StyledInputSelect = styled(Select)<{
  ownerState: {
    fullWidth?: boolean;
    width?: string;
    colorType: 'normal' | 'error';
  };
}>(({ theme, ownerState: { fullWidth, width, colorType } }) => {
  const iconPositionRight = pxToRem(8);
  const iconPositionTop = pxToRem(6);
  const borderColor = '#E6E8EE';

  return {
    width: fullWidth ? '100%' : width || 'unset',
    backgroundColor: theme.palette.neutral[10],
    height: inputTokens.height.small,
    borderRadius: inputTokens.borderRadius,
    padding: 0,
    cursor: 'default',
    position: 'relative',

    // Focus outline effect
    ...focusOutlineMixin(theme, colorType),

    // Border states
    ...borderStateMixin(theme, colorType),

    '& .MuiSelect-select': {
      cursor: 'default',
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
      color: theme.palette.neutral[100],
      padding: inputTokens.padding.small,
      height: inputTokens.height.small,
      '& .MuiTypography-root': {},
    },
    '& fieldset': {
      top: 0,
      borderColor,
      height: inputTokens.height.small,
      color: '#000000',
      '& legend': {
        display: 'none',
      },
    },
    '& .MuiSelect-icon': {
      position: 'absolute',
      right: iconPositionRight,
      top: iconPositionTop,
      color: `${theme.palette.neutral[80]} !important`,
    },
  };
});
