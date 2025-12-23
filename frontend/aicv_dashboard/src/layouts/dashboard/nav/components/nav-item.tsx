import { ListItem, ListItemButton, Typography, useTheme } from '@mui/material';
import { RouterLink } from 'src/routes/components';
import { SvgColor } from 'src/components/svg/svg-color';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { pxToRem } from 'src/theme/styles';
import type { INavItem } from 'src/layouts/config-nav-dashboard';
import BaseIcon from 'src/components/svg/base-icon/base-icon';

type NavItemProps = {
  item: INavItem;
  isActive: boolean;
  isCollapsed: boolean;
  hasChildren: boolean;
  isOpen: boolean;
  onItemClick: (event: React.MouseEvent<HTMLElement>) => void;
  onToggle: () => void;
};

export function NavItem({
  item,
  isActive,
  isCollapsed,
  hasChildren,
  isOpen,
  onItemClick,
  onToggle,
}: NavItemProps) {
  const theme = useTheme();

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (hasChildren) {
      e.preventDefault();
      onItemClick(e);
      if (!isCollapsed) {
        onToggle();
      }
    } else {
      onItemClick(e);
    }
  };

  return (
    <ListItem disableGutters disablePadding>
      <ListItemButton
        disableGutters
        component={RouterLink}
        href={item.path || '#'}
        onClick={handleClick}
        sx={{
          padding: '8px',
          gap: '6px',
          borderRadius: 1,
          minHeight: 'var(--layout-nav-item-height)',
          ...(isActive && {
            bgcolor: 'var(--layout-nav-item-active-bg)',
            '&:hover': {
              bgcolor: 'var(--layout-nav-item-active-bg)',
            },
          }),
        }}
      >
        <BaseIcon
          size={20}
          src={item.icon}
          color={
            isActive ? theme.palette.neutral[80] : theme.palette.neutral[50]
          }
        />

        {!isCollapsed && (
          <Typography
            component='span'
            variant='t4SemiBold'
            flexGrow={1}
            color={theme.palette.neutral[100]}
          >
            {item.title}
          </Typography>
        )}

        {hasChildren && !isCollapsed && (
          <SvgColor
            src={
              isOpen
                ? ASSET_CONSTANT.SVG.IconCaretUp
                : ASSET_CONSTANT.SVG.IconCaretDown
            }
            width={pxToRem(16)}
            height={pxToRem(16)}
            color={isActive ? 'neutral.90' : 'neutral.40'}
          />
        )}
      </ListItemButton>
    </ListItem>
  );
}
