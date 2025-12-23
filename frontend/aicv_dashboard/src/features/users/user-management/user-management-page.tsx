import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { UserManagementView } from './user-management-view';
import { FEATURE } from 'src/constants/feature-constant';

// ----------------------------------------------------------------------

export default function UserManagementPage() {
  return (
    <>
      <Helmet>
        <title> {`${FEATURE.USER_MANAGEMENT.title} - ${CONFIG.appName}`}</title>
      </Helmet>

      <UserManagementView />
    </>
  );
}
