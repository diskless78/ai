import { useState, useCallback } from 'react';
import type { INavItem } from 'src/layouts/config-nav-dashboard';

export function useNavPopover() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>, item: INavItem) => {
      setHoveredItem(item.title);
      setAnchorEl(event.currentTarget);
    },
    []
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
    setHoveredItem(null);
  }, []);

  return {
    hoveredItem,
    anchorEl,
    isOpen: Boolean(anchorEl),
    handleOpen,
    handleClose,
  };
}
