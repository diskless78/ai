import type { BoxProps } from '@mui/material/Box';

import { forwardRef } from 'react';

import Box from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { SvgColor } from '../svg/svg-color';
import SvgImage from '../svg/svg-image/svg-image';
import { useTheme } from '@mui/material';

// ----------------------------------------------------------------------

export type LogoProps = BoxProps & {
  width: number;
  height: number;
  href?: string;
  single?: boolean;
  disableLink?: boolean;
};

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    {
      width,
      href = '/',
      height,
      single = false,
      disableLink = false,
      className,
      sx,
      ...other
    },
    ref
  ) => {
    const theme = useTheme();

    const singleLogo = (
      <SvgColor
        src={ASSET_CONSTANT.SVG.LogoSingle}
        width={width}
        height={height}
      />
    );

    const fullLogo = (
      <SvgImage
        width={width}
        height={height}
        src={
          theme.palette.mode === 'dark'
            ? ASSET_CONSTANT.SVG.LogoFullDark
            : ASSET_CONSTANT.SVG.LogoFullLight
        }
      />
    );

    const baseSize = {
      width: width ?? 50,
      height: height ?? 36,
      ...(!single && {
        width: width ?? 50,
        height: height ?? 36,
      }),
    };

    return (
      <Box
        ref={ref}
        component={RouterLink}
        href={href}
        className={className}
        aria-label='Logo'
        sx={{
          ...baseSize,
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          verticalAlign: 'middle',
          ...(disableLink && { pointerEvents: 'none' }),
          ...sx,
        }}
        {...other}
      >
        {single ? singleLogo : fullLogo}
      </Box>
    );
  }
);
