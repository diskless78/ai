import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useRouter, usePathname } from 'src/routes/hooks';

import Row from 'src/components/common/row';
import { pxToRem } from 'src/theme/styles';
import SizedBox from 'src/components/common/sized-box';
import Column from 'src/components/common/column';
import { SvgColor } from 'src/components/svg/svg-color';
import { authSelector, useAppSelector } from 'src/store';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'src/store';
import BaseAvatar from 'src/components/data-display/base-avatar/base-avatar';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { logoutAsync } from 'src/store/thunks/auth.thunk';
import { useLanguage } from 'src/i18n/i18n';

// ----------------------------------------------------------------------

export type AccountPopoverProps = IconButtonProps & {
  data?: {
    label: string;
    href: string;
    icon: string;
    info?: React.ReactNode;
  }[];
};

export function AccountPopover({ data = [] }: AccountPopoverProps) {
  const router = useRouter();
  const lang = useLanguage();
  const { user } = useAppSelector(authSelector);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const pathname = usePathname();

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(
    null
  );

  const handleOpenPopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpenPopover(event.currentTarget);
    },
    []
  );

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleClickItem = useCallback(
    (path: string) => {
      handleClosePopover();
      router.push(path);
    },
    [handleClosePopover, router]
  );

  return (
    <>
      <IconButton
        onClick={handleOpenPopover}
        disableRipple
        sx={{
          padding: `${pxToRem(3)} ${pxToRem(4)}`,
          borderRadius: 0,
          width: pxToRem(240),
          justifyContent: 'space-between',
        }}
      >
        <Row gap={pxToRem(8)}>
          <BaseAvatar size={36} />
          <Column alignItems='start'>
            <Typography variant='t3SemiBold' color='neutral.999'>
              {user?.name ?? 'anonymous'}
            </Typography>
            <Typography variant='b4Medium' color='neutral.60'>
              {user?.email ?? 'anonymous@cxview.ai'}
            </Typography>
          </Column>
        </Row>
        <SvgColor
          src={ASSET_CONSTANT.SVG.IconLinearArrowDown}
          width={pxToRem(24)}
          height={pxToRem(24)}
          color='neutral.60'
        />
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              width: pxToRem(269),
              backgroundColor: 'neutral.0',
              px: pxToRem(8),
              boxShadow: '0px 8px 24px 0px #0000002E',
              borderRadius: pxToRem(12),
              border: '1px solid',
              borderColor: 'neutral.20',
            },
          },
        }}
      >
        <Row
          gap={pxToRem(8)}
          px={pxToRem(6)}
          py={pxToRem(12)}
          alignItems='center'
        >
          <BaseAvatar size={46} />
          <Column>
            <Typography variant='t1SemiBold'>
              {user?.name ?? 'anonymous'}
            </Typography>
            <SizedBox height={2} />
            <Typography variant='b3Regular'>
              {user?.email ?? 'anonymous@cxview.ai'}{' '}
            </Typography>
          </Column>
        </Row>
        <Divider sx={{ color: 'neutral.20' }} />
        <MenuList
          disablePadding
          sx={{
            py: pxToRem(12),
            gap: pxToRem(8),
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              height: pxToRem(38),
              px: pxToRem(6),
              py: pxToRem(8.5),
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: pxToRem(6),
              '&:hover': { color: 'text.primary' },
              [`&.${menuItemClasses.selected}`]: {
                color: 'text.primary',
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightSemiBold',
              },
            },
          }}
        >
          {data.map((option) => (
            <MenuItem
              key={option.label}
              selected={option.href === pathname}
              onClick={() => handleClickItem(option.href)}
            >
              <SvgColor
                width={pxToRem(24)}
                height={pxToRem(24)}
                src={option.icon}
                color='neutral.100'
              />
              <SizedBox width={8} />
              <Typography variant='t3SemiBold' color='neutral.100' noWrap>
                {option.label}
              </Typography>
            </MenuItem>
          ))}
        </MenuList>

        <Divider sx={{ color: 'neutral.20' }} />

        <Box sx={{ py: pxToRem(12) }}>
          <Button
            fullWidth
            color='error'
            size='medium'
            variant='text'
            sx={{
              justifyContent: 'start',
              p: `${pxToRem(4)} ${pxToRem(6)}`,
            }}
            onClick={() => {
              handleClosePopover();
              dispatch(logoutAsync({ navigate }));
            }}
          >
            <Row alignItems='center' justifyContent='start' gap={pxToRem(8)}>
              <SvgColor
                width={pxToRem(24)}
                height={pxToRem(24)}
                src={ASSET_CONSTANT.SVG.IconLinearLogout}
                color='orange.70'
              />
              <Typography
                variant='t3SemiBold'
                textTransform='none'
                color='orange.70'
              >
                {lang('Action.Logout')}
              </Typography>
            </Row>
          </Button>
        </Box>
      </Popover>
    </>
  );
}
