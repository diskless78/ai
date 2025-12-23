import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { PermissionManagementView } from './permission-management-view';
import { FEATURE } from 'src/constants/feature-constant';

// ----------------------------------------------------------------------

export default function PermissionManagementPage() {
  return (
    <>
      <Helmet>
        <title>
          {`${FEATURE.PERMISSION_MANAGEMENT.title} - ${CONFIG.appName}`}
        </title>
      </Helmet>

      <PermissionManagementView />
    </>
  );
}
