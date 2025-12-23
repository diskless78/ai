import { forwardRef } from 'react';

import Box from '@mui/material/Box';

import { baseIconClasses } from './classes';

import type { SvgColorProps } from './types';

export const SvgColor = forwardRef<HTMLSpanElement, SvgColorProps>(
  ({ src, width = 24, height, opacity, className, sx, ...other }, ref) => (
    <Box
      ref={ref}
      component='span'
      className={baseIconClasses.root.concat(className ? ` ${className}` : '')}
      sx={{
        width,
        flexShrink: 0,
        height: height ?? width,
        display: 'inline-flex',
        bgcolor: 'currentColor',
        opacity: opacity ?? 1,
        mask: `url(${src}) no-repeat center / contain`,
        WebkitMask: `url(${src}) no-repeat center / contain`,
        ...sx,
      }}
      {...other}
    />
  )
);
