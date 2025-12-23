import { Box, MenuItem, MenuList, Popover } from '@mui/material';
import { RouterLink } from 'src/routes/components';
import type { ISubItem } from 'src/layouts/config-nav-dashboard';

type NavPopoverProps = {
  isOpen: boolean;
  anchorEl: HTMLElement | null;
  items: ISubItem[];
  onClose: () => void;
};

export function NavPopover({
  isOpen,
  anchorEl,
  items,
  onClose,
}: NavPopoverProps) {
  return (
    <Popover
      open={isOpen}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'left',
      }}
      PaperProps={{
        sx: {
          backgroundColor: 'white',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <MenuList>
        {items.map((child) => (
          <MenuItem
            key={child.title}
            component={RouterLink}
            href={child.path ?? ''}
            onClick={onClose}
          >
            <Box>{child.title}</Box>
          </MenuItem>
        ))}
      </MenuList>
    </Popover>
  );
}
