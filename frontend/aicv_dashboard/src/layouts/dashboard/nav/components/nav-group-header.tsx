import { ListSubheader } from '@mui/material';

type NavGroupHeaderProps = {
  title: string;
  isCollapsed: boolean;
};

export function NavGroupHeader({ title, isCollapsed }: NavGroupHeaderProps) {
  if (isCollapsed) return null;

  return (
    <ListSubheader
      sx={{
        pl: '8px',
        typography: 't4SemiBold',
        color: 'neutral.60',
        backgroundColor: 'transparent',
        position: 'relative',
        top: 'auto',
      }}
    >
      {title}
    </ListSubheader>
  );
}
