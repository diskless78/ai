import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { ZoneTrafficView } from './zone-traffic-view';

// ----------------------------------------------------------------------

export default function ZoneTrafficPage() {
  return (
    <>
      <Helmet>
        <title> {`Zone traffic - ${CONFIG.appName}`}</title>
      </Helmet>

      <ZoneTrafficView />
    </>
  );
}
