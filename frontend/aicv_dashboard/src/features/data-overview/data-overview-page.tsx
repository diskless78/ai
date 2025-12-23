import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { DataOverviewView } from './data-overview-view';
import { FEATURE } from 'src/constants/feature-constant';

// ----------------------------------------------------------------------

export default function DataOverviewPage() {
  return (
    <>
      <Helmet>
        <title> {`${FEATURE.DATA_OVERVIEW.title} - ${CONFIG.appName}`}</title>
      </Helmet>

      <DataOverviewView />
    </>
  );
}
