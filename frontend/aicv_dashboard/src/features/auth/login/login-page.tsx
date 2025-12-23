import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { LoginView } from './login-view';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> {`Login - ${CONFIG.appName}`}</title>
      </Helmet>

      <LoginView />
    </>
  );
}
