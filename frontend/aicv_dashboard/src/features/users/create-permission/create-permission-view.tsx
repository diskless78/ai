import { useNavigate } from 'react-router-dom';
import Column from 'src/components/common/column';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { pxToRem } from 'src/theme/styles';
import { FormCreateRole } from './components/form-create-role/form-create-role';
import { ROUTES_CONSTANT } from 'src/constants/routes.constant';

export function CreatePermissionView() {
    const navigate = useNavigate();

    const handleClose = () => {
        navigate(ROUTES_CONSTANT.PERMISSION_MANAGEMENT);
    };

    return (
        <DashboardContent disablePadding maxWidth={false}>
            <Column
                padding={`${pxToRem(16)} ${pxToRem(16)} ${pxToRem(20)} ${pxToRem(16)}`}
                gap={pxToRem(20)}
            >
                <FormCreateRole onClose={handleClose} />
            </Column>
        </DashboardContent>
    );
}
