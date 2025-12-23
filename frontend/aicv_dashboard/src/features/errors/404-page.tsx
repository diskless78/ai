import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { NotFoundView } from './404-view';

// ----------------------------------------------------------------------

export default function NotFoundPage() {
    return (
        <>
            <Helmet>
                <title> {`404 - Page Not Found - ${CONFIG.appName}`}</title>
            </Helmet>

            <NotFoundView />
        </>
    );
}
