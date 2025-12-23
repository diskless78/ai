import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES_CONSTANT } from 'src/constants/routes.constant';
import type { RootState } from 'src/store';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES_CONSTANT.LOGIN} replace />;
  }

  return children ? children : <Outlet />;
}
