import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { UserDetailView } from './user-detail-view';

// ----------------------------------------------------------------------

export default function UserDetailPage() {
  return (
    <>
      <Helmet>
        <title> {`User Detail - ${CONFIG.appName}`}</title>
      </Helmet>

      <UserDetailView />
    </>
  );
}
