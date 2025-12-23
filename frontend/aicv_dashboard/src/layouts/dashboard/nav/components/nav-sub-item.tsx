import { Box, ListItem, ListItemButton, Typography } from '@mui/material';
import { RouterLink } from 'src/routes/components';
import type { ISubItem } from 'src/layouts/config-nav-dashboard';

type NavSubItemProps = {
  item: ISubItem;
  isActive: boolean;
};

export function NavSubItem({ item, isActive }: NavSubItemProps) {
  return (
    <ListItem disableGutters disablePadding>
      <ListItemButton
        disableGutters
        component={RouterLink}
        href={item.path || '#'}
        sx={{
          pl: 2,
          py: 1,
          gap: 2,
          pr: 1.5,
          borderRadius: 0.75,
          display: 'inline-flex',
          alignItems: 'center',
          '&:hover': {
            backgroundColor: 'var(--palette-action-hover)',
          },
        }}
      >
        <Box
          component='span'
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: isActive ? 'purple.70' : 'transparent',
          }}
        />
        <Typography
          variant='t4SemiBold'
          color={isActive ? 'purple.70' : 'neutral.100'}
        >
          {item.title}
        </Typography>
      </ListItemButton>
    </ListItem>
  );
}
