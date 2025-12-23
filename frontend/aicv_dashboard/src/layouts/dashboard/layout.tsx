import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { pxToRem } from 'src/theme/styles';
import Row from 'src/components/common/row';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, authSelector, useAppSelector } from 'src/store';
import { useLanguage } from 'src/i18n/i18n';
import { Main } from './main';
import { layoutClasses } from '../classes';
import { useNavData } from '../config-nav-dashboard';
// import { _workspaces } from '../config-nav-workspace';

import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { AccountPopover } from '../components/account-popover';
import { MenuButton } from '../components/menu-button';
import { NavDesktop } from './nav/nav-desktop';
import { NavMobile } from './nav/nav-mobile';
import LanguageToggle from 'src/components/controls/language-toggle';
import ButtonTheme from 'src/components/button/button-theme/button-theme';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { CONFIG } from 'src/config-global';
import { logoutAsync } from 'src/store/thunks/auth.thunk';

// ----------------------------------------------------------------------

export type DashboardLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function DashboardLayout({
  sx,
  children,
  header,
}: DashboardLayoutProps) {
  const lang = useLanguage();
  const theme = useTheme();
  const navData = useNavData();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector(authSelector);
  const [navOpen, setNavOpen] = useState(false);
  const [statusNav, setStatusNav] = useState<boolean | undefined>(undefined);
  const layoutQuery: Breakpoint = 'lg';

  useEffect(() => {
    const init = async () => {
      if (!token || !user) {
        dispatch(logoutAsync({ navigate }));
      }
    };

    init();
  }, [dispatch, navigate, token, user]);

  return (
    <LayoutSection
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          slotProps={{
            container: {
              maxWidth: false,
              sx: {
                pl: { [layoutQuery]: pxToRem(24) },
                pr: { [layoutQuery]: pxToRem(19) },
              },
            },
          }}
          sx={header?.sx}
          slots={{
            topArea: (
              <Alert severity='info' sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: (
              <>
                <MenuButton
                  onClick={() => setNavOpen(true)}
                  sx={{
                    ml: -1,
                    [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
                  }}
                />
                <NavMobile
                  data={navData}
                  open={navOpen}
                  onClose={() => setNavOpen(false)}
                  // workspaces={_workspaces}
                />
              </>
            ),
            rightArea: (
              <Row gap={pxToRem(16)} alignItems='center'>
                {CONFIG.toggleLanguage && <LanguageToggle />}
                {CONFIG.toggleTheme && <ButtonTheme size='small' />}
                {/* <NotificationsPopover
                  data={_notifications}
                  sx={{ px: '6px', py: '6px' }}
                /> */}
                <AccountPopover
                  data={[
                    {
                      label: lang('Function.AccountSetting'),
                      href: '#',
                      icon: ASSET_CONSTANT.SVG.IconLinearSettings2,
                    },
                    {
                      label: lang('Function.Support'),
                      href: '#',
                      icon: ASSET_CONSTANT.SVG.IconLinearHelp,
                    },
                  ]}
                />
              </Row>
            ),
          }}
        />
      }
      sidebarSection={
        <NavDesktop
          data={navData}
          layoutQuery={layoutQuery}
          // workspaces={_workspaces}
          width={
            statusNav
              ? 'var(--layout-nav-vertical-width-xs)'
              : 'var(--layout-nav-vertical-width)'
          }
          setStatusNav={setStatusNav}
        />
      }
      footerSection={null}
      cssVars={{
        '--layout-nav-vertical-width': '240px',
        '--layout-nav-vertical-width-xs': '60px',
        '--layout-dashboard-content-pt': theme.spacing(1),
        '--layout-dashboard-content-pb': theme.spacing(8),
        '--layout-dashboard-content-px': theme.spacing(5),
      }}
      sx={{
        backgroundColor: 'var(--layout-dashboard-bg)',
        [`& .${layoutClasses.hasSidebar}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            pl: statusNav
              ? 'var(--layout-nav-vertical-width-xs)'
              : 'var(--layout-nav-vertical-width)',
          },
        },
        ...sx,
      }}
    >
      <Main>{children}</Main>
    </LayoutSection>
  );
}
