import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import React from 'react';

import { useTheme } from '@mui/material/styles';

import { layoutClasses } from '../classes';
import { LayoutSection } from '../core/layout-section';
import { Main } from './main';

// ----------------------------------------------------------------------

export type SimpleLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
};

export function SimpleLayout({ sx, children }: SimpleLayoutProps) {
  const theme = useTheme();

  const layoutQuery: Breakpoint = 'lg';

  return (
    <LayoutSection
      footerSection={null}
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        minHeight: '100%',
        height: '100vh',
        [`& .${layoutClasses.hasSidebar}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            pl: 'var(--layout-nav-vertical-width)',
          },
        },
        ...sx,
      }}
    >
      <Main>{children}</Main>
    </LayoutSection>
  );
}
