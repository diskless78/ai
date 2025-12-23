import { lazy, Suspense, useEffect } from 'react';
import { Outlet, Navigate, useRoutes, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';

import { DashboardLayout } from 'src/layouts/dashboard/layout';
import { ROUTES_CONSTANT } from 'src/constants/routes.constant';
import { SimpleLayout } from 'src/layouts/simple';
import { AuthGuard } from './guards/AuthGuard';
import { GuestGuard } from './guards/GuestGuard';
import { initSystemDataAsync } from 'src/store/thunks/system.thunk';
import { useAppDispatch } from 'src/store';

// ----------------------------------------------------------------------

export const LoginPage = lazy(
  () => import('src/features/auth/login/login-page')
);

export const DataOverviewPage = lazy(
  () => import('src/features/data-overview/data-overview-page')
);
export const VisitorCountPage = lazy(
  () => import('src/features/analytic/visitor-count/visitor-count-page')
);
export const ZoneTrafficPage = lazy(
  () => import('src/features/analytic/zone-traffic/zone-traffic-page')
);
export const UserManagementPage = lazy(
  () => import('src/features/users/user-management/user-management-page')
);
export const UserDetailPage = lazy(
  () => import('src/features/users/user-detail/user-detail-page')
);
export const PermissionManagementPage = lazy(
  () =>
    import(
      'src/features/users/permission-management/permission-management-page'
    )
);
export const CreatePermissionPage = lazy(
  () => import('src/features/users/create-permission/create-permission-page')
);
export const PermissionDetailPage = lazy(
  () => import('src/features/users/permission/permission-page')
);
export const EditPermissionPage = lazy(
  () => import('src/features/users/edit-permission/edit-permission-page')
);
export const TestPage = lazy(
  () => import('src/features/analytic/test-page/test-page')
);

export const ColorPalettePage = lazy(
  () =>
    import('src/features/theme-configuration/color-palette/color-palette-page')
);

// Boka
export const ColorCheckPage = lazy(
  () => import('src/features/boka/product/color-check/color-check-page')
);
export const ProductManagementPage = lazy(
  () =>
    import(
      'src/features/boka/product/product-management/product-management-page'
    )
);
export const ProductCategoryPage = lazy(
  () =>
    import('src/features/boka/product/product-category/product-category-page')
);
export const Page404 = lazy(() => import('src/features/errors/404-page'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box
    display='flex'
    alignItems='center'
    justifyContent='center'
    flex='1 1 auto'
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => theme.palette.purple[20],
        [`& .${linearProgressClasses.bar}`]: {
          bgcolor: (theme) => theme.palette.purple[80],
        },
      }}
    />
  </Box>
);

export function Router() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(initSystemDataAsync({ navigate }));
  }, [dispatch, navigate]);

  return useRoutes([
    {
      element: (
        <AuthGuard>
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </AuthGuard>
      ),
      children: [
        { element: <DataOverviewPage />, index: true },
        {
          path: ROUTES_CONSTANT.VISITOR_COUNT,
          element: <VisitorCountPage />,
        },
        {
          path: ROUTES_CONSTANT.ZONE_TRAFFIC,
          element: <ZoneTrafficPage />,
        },
        {
          path: ROUTES_CONSTANT.USER_MANAGEMENT,
          element: <UserManagementPage />,
        },
        {
          path: ROUTES_CONSTANT.CREATE_USER,
          element: <UserDetailPage />,
        },
        {
          path: ROUTES_CONSTANT.PERMISSION_MANAGEMENT,
          element: <PermissionManagementPage />,
        },
        {
          path: ROUTES_CONSTANT.CREATE_ROLE,
          element: <CreatePermissionPage />,
        },
        { path: ROUTES_CONSTANT.COLOR_PALETTE, element: <ColorPalettePage /> },
        {
          path: `${ROUTES_CONSTANT.PERMISSION_DETAIL}/:id`,
          element: <PermissionDetailPage />,
        },
        {
          path: `${ROUTES_CONSTANT.EDIT_ROLE}/:id`,
          element: <EditPermissionPage />,
        },
        // {
        //   path: ROUTES_CONSTANT.TEST_PAGE,
        //   element: <TestPage />,
        // },
        // {
        //   path: ROUTES_CONSTANT.PRODUCT_MANAGEMENT,
        //   element: <ProductManagementPage />,
        // },
        // {
        //   path: ROUTES_CONSTANT.PRODUCT_CATEGORY,
        //   element: <ProductCategoryPage />,
        // },
      ],
    },
    {
      element: (
        <GuestGuard>
          <SimpleLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </SimpleLayout>
        </GuestGuard>
      ),
      children: [
        {
          path: ROUTES_CONSTANT.COLOR_CHECK,
          element: <ColorCheckPage />,
        },
        {
          path: ROUTES_CONSTANT.LOGIN,
          element: <LoginPage />,
        },
      ],
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to='/404' replace />,
    },
  ]);
}
