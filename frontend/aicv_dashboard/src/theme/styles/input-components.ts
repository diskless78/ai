import { pxToRem } from '.';
import type { Theme } from '@mui/material/styles';
// Design tokens cho Input components
export const inputTokens = {
  height: {
    small: pxToRem(36),
    medium: pxToRem(40),
  },
  borderRadius: pxToRem(12),
  borderWidth: '1px',
  padding: {
    small: `${pxToRem(6)} ${pxToRem(8)}`,
    medium: `${pxToRem(8)} ${pxToRem(12)}`,
    large: pxToRem(12),
  },
  icon: {
    position: {
      right: pxToRem(8),
      top: pxToRem(6),
    },
  },
  outline: {
    width: '3px',
    offset: -3,
    borderRadius: pxToRem(15),
    transition: 'opacity 0.3s ease',
  },
};
// Mixin cho focus outline effect
export const focusOutlineMixin = (
  theme: Theme,
  colorType: 'normal' | 'error' = 'normal'
) => ({
  '&::after': {
    content: '""',
    position: 'absolute',
    top: inputTokens.outline.offset,
    left: inputTokens.outline.offset,
    right: inputTokens.outline.offset,
    bottom: inputTokens.outline.offset,
    border: `${inputTokens.outline.width} solid ${
      colorType === 'error' ? theme.palette.orange[10] : theme.palette.blue[10]
    }`,
    borderRadius: inputTokens.outline.borderRadius,
    pointerEvents: 'none',
    opacity: 0,
    transition: inputTokens.outline.transition,
  },
  '&.Mui-focused::after': {
    opacity: 1,
  },
});
// Mixin cho border states
export const borderStateMixin = (
  theme: Theme,
  colorType: 'normal' | 'error' = 'normal'
) => {
  const borderColorDefault = theme.palette.neutral[20];
  const borderColorError = theme.palette.orange[70];
  const borderColorFocus = theme.palette.blue[60];
  return {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor:
        colorType === 'error' ? borderColorError : borderColorDefault,
      borderRadius: inputTokens.borderRadius,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: colorType === 'error' ? borderColorError : borderColorFocus,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: colorType === 'error' ? borderColorError : borderColorFocus,
      borderWidth: inputTokens.borderWidth,
    },
  };
};
