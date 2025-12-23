import { Helmet } from 'react-helmet-async';
import { EditPermissionView } from './edit-permission-view';
import { CONFIG } from 'src/config-global';

export default function EditPermissionPage() {
    return (
        <>
            <Helmet>
                <title>{`Edit Role - Permission Management - ${CONFIG.appName}`}</title>
            </Helmet>

            <EditPermissionView />
        </>
    );
}
