import type { FC } from 'react';
import {
  Drawer,
  IconButton,
  Avatar,
  Stack,
  alpha,
  styled,
  Divider,
  useTheme,
} from '@mui/material';
import { SvgColor } from 'src/components/svg/svg-color';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { pxToRem } from 'src/theme/styles';
import { rootNavItems } from 'src/layouts/config-nav-dashboard';
import Column from 'src/components/common/column';
import ButtonTheme from 'src/components/button/button-theme/button-theme';
import SizedBox from 'src/components/common/sized-box';

interface RootSidebarProps {
  activeId: string;
  onChange?: (id: string) => void;
  avatarSrc?: string;
}

/* ---------- styled helpers ---------- */
const StyledRootSidebar = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 66,
    backgroundColor: theme.palette.neutral[20],
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden',
  },
}));

const IconWrapper = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  width: pxToRem(40),
  height: pxToRem(40),
  marginBlock: pxToRem(6),
  borderRadius: pxToRem(10),
  backgroundColor: active ? theme.palette.neutral[0] : 'transparent',
  color: active ? theme.palette.purple[60] : theme.palette.neutral[40],
  transition: 'background-color 120ms, color 120ms',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.18),
  },
}));

/* ---------- component ---------- */
export const RootSidebar: FC<RootSidebarProps> = ({
  activeId,
  onChange,
  avatarSrc,
}) => {
  const theme = useTheme();

  return (
    <StyledRootSidebar variant='permanent' anchor='left' open>
      <Column sx={{ px: pxToRem(21), py: pxToRem(22) }}>
        <SvgColor
          src={ASSET_CONSTANT.SVG.IconLinearExtend}
          width={24}
          height={24}
        />
      </Column>
      <Divider sx={{ borderColor: theme.palette.neutral[30], width: '100%' }} />

      <Stack
        flexGrow={1}
        justifyContent='flex-start'
        alignItems='center'
        pt={pxToRem(24)}
      >
        {rootNavItems.map((item) => (
          <IconWrapper
            key={item.id}
            active={item.id === activeId}
            onClick={() => onChange?.(item.id)}
          >
            {item.icon}
          </IconWrapper>
        ))}
      </Stack>

      <ButtonTheme />
      <SizedBox height={16} />

      {/* bottom avatar */}
      <Avatar
        src={avatarSrc}
        sx={{
          width: pxToRem(44),
          height: pxToRem(44),
          bgcolor: 'warning.light',
          border: (theme) =>
            `2px solid ${alpha(theme.palette.common.white, 0.8)}`,
        }}
      />
    </StyledRootSidebar>
  );
};
