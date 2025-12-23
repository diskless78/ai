import type { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export const baseVars = (theme: Theme) => ({
  // nav
  '--layout-nav-bg': theme.palette.neutral[10],
  '--layout-nav-zIndex': 1101,
  '--layout-nav-mobile-width': '320px',
  '--layout-nav-border-color': theme.palette.neutral[20],
  // nav item
  '--layout-nav-item-height': '36px',
  '--layout-nav-item-color': 'rgba(255, 255, 255, 0.2)',
  '--layout-nav-item-active-color': theme.palette.neutral[80],
  '--layout-nav-item-active-bg': theme.palette.purple[20],
  '--layout-nav-item-hover-bg': theme.palette.neutral[30],
  // header
  '--layout-header-blur': '8px',
  '--layout-header-zIndex': 1100,
  '--layout-header-mobile-height': '64px',
  '--layout-header-desktop-height': '60px',
  '--layout-header-bg': theme.palette.neutral[0],
  // dashboard
  '--layout-dashboard-bg': theme.palette.neutral[0],
});
