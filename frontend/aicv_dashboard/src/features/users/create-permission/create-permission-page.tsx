import { Helmet } from 'react-helmet-async';
import { CreatePermissionView } from './create-permission-view';
import { CONFIG } from 'src/config-global';

export default function CreatePermissionPage() {
    return (
        <>
            <Helmet>
                <title>{`Create Role - Permission Management - ${CONFIG.appName}`}</title>
            </Helmet>

            <CreatePermissionView />
        </>
    );
}
