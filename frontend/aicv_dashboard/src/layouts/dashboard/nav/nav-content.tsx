import { Box, type SxProps, type Theme } from '@mui/material';
import React from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import SizedBox from 'src/components/common/sized-box';
import { usePathname } from 'src/routes/hooks';
import { CONFIG } from 'src/config-global';
import type { IMainNavItem, INavItem } from 'src/layouts/config-nav-dashboard';
import { useNavCollapse, useNavPopover } from './hooks';
import {
  NavHeader,
  NavGroupHeader,
  NavItem,
  NavSubItem,
  NavPopover,
} from './components';

export type NavContentProps = {
  data: IMainNavItem[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  sx?: SxProps<Theme>;
};

type NavContentWithCollapseProps = NavContentProps & {
  onCollapseChange: (collapsed: boolean) => void;
};

export function NavContent({
  data,
  slots,
  sx,
  onCollapseChange,
}: NavContentWithCollapseProps) {
  const pathname = usePathname();
  const { isCollapsed, openItems, handleCollapse, toggleItem } = useNavCollapse(
    CONFIG.expandedSidebar,
    onCollapseChange
  );
  const { hoveredItem, anchorEl, isOpen, handleOpen, handleClose } =
    useNavPopover();

  const handleItemClick = (
    event: React.MouseEvent<HTMLElement>,
    item: INavItem
  ) => {
    if (isCollapsed && item.subItems) {
      handleOpen(event, item);
    } else {
      handleClose();
    }
  };

  const isItemActive = (item: INavItem): boolean => {
    return (
      item.path === pathname ||
      item.subItems?.some((child) => child.path === pathname) ||
      false
    );
  };

  return (
    <>
      <NavHeader isCollapsed={isCollapsed} onCollapse={handleCollapse} />
      {slots?.topArea}
      <SizedBox height={isCollapsed ? 53 : 31} />
      <Scrollbar fillContent>
        <Box component='nav' display='flex' flexDirection='column' sx={sx}>
          <Box
            component='ul'
            display='flex'
            flexDirection='column'
            sx={{ overflowY: 'auto' }}
          >
            {data.map((group, index) => (
              <Box
                key={group.title}
                display='flex'
                flexDirection='column'
                gap={isCollapsed ? '16px' : '4px'}
                sx={{ marginBottom: index < data.length - 1 ? '32px' : 0 }}
              >
                <NavGroupHeader title={group.title} isCollapsed={isCollapsed} />
                {group.items.map((item) => {
                  const isActive = isItemActive(item);
                  const hasChildren = Boolean(
                    item.subItems && item.subItems.length > 0
                  );
                  const isItemOpen = openItems.has(item.title);

                  return (
                    <React.Fragment key={item.title}>
                      <NavItem
                        item={item}
                        isActive={isActive}
                        isCollapsed={isCollapsed}
                        hasChildren={hasChildren}
                        isOpen={isItemOpen}
                        onItemClick={(e) => handleItemClick(e, item)}
                        onToggle={() => toggleItem(item.title)}
                      />

                      {/* Popover for collapsed state */}
                      {hasChildren &&
                        isCollapsed &&
                        hoveredItem === item.title && (
                          <NavPopover
                            isOpen={isOpen}
                            anchorEl={anchorEl}
                            items={item.subItems || []}
                            onClose={handleClose}
                          />
                        )}

                      {/* Sub-items for expanded state */}
                      {hasChildren && isItemOpen && !isCollapsed && (
                        <Box component='ul'>
                          {item.subItems?.map((child) => (
                            <NavSubItem
                              key={child.title}
                              item={child}
                              isActive={pathname === child.path}
                            />
                          ))}
                        </Box>
                      )}
                    </React.Fragment>
                  );
                })}
              </Box>
            ))}
          </Box>
        </Box>
      </Scrollbar>
      {slots?.bottomArea}
    </>
  );
}
