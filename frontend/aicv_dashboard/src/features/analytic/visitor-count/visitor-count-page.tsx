import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { VisitorCountView } from './visitor-count-view';
import { FEATURE } from 'src/constants/feature-constant';

// ----------------------------------------------------------------------

export default function VisitorCountPage() {
  return (
    <>
      <Helmet>
        <title> {`${FEATURE.VISITOR_COUNT.title} - ${CONFIG.appName}`}</title>
      </Helmet>

      <VisitorCountView />
    </>
  );
}
