import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { ColorCheckView } from './color-check-view';

// ----------------------------------------------------------------------

export default function ColorCheckPage() {
  return (
    <>
      <Helmet>
        <title> {`Color Check - ${CONFIG.appName}`}</title>
      </Helmet>

      <ColorCheckView />
    </>
  );
}
