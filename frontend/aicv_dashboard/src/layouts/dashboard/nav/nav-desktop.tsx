import { type Breakpoint, Box, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';
import { CONFIG } from 'src/config-global';
import { NavContent, type NavContentProps } from './nav-content';

type NavDesktopProps = NavContentProps & {
  layoutQuery: Breakpoint;
  width?: string;
  setStatusNav?: (collapsed: boolean) => void;
};

export function NavDesktop({
  sx,
  data,
  slots,
  layoutQuery,
  width = 'var(--layout-nav-vertical-width)',
  setStatusNav,
}: NavDesktopProps) {
  const theme = useTheme();
  const [collapsed, setCollapsed] = useState(CONFIG.expandedSidebar);

  useEffect(() => {
    setStatusNav?.(collapsed);
  }, [collapsed, setStatusNav]);

  const handleCollapseChange = (newCollapsedState: boolean) => {
    setCollapsed(newCollapsedState);
  };

  return (
    <Box
      sx={{
        pt: '17px',
        px: collapsed ? '11px' : '12px',
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: 'var(--layout-nav-bg)',
        zIndex: 'var(--layout-nav-zIndex)',
        width: { width },
        border: `1px solid var(--layout-nav-border-color)`,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavContent
        data={data}
        slots={slots}
        onCollapseChange={handleCollapseChange}
      />
    </Box>
  );
}
