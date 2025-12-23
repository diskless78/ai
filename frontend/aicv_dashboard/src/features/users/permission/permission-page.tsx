import { Helmet } from 'react-helmet-async';
import { PermissionView } from './permission-view';
import { CONFIG } from 'src/config-global';

export default function PermissionPage() {
    return (
        <>
            <Helmet>
                <title>{`Permission Detail - ${CONFIG.appName}`}</title>
            </Helmet>

            <PermissionView />
        </>
    );
}
