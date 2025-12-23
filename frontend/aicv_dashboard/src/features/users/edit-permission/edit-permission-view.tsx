import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Column from 'src/components/common/column';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { pxToRem } from 'src/theme/styles';
import { FormEditRole } from './components/form-edit-role/form-edit-role';
import { ROUTES_CONSTANT } from 'src/constants/routes.constant';

export function EditPermissionView() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    // Get roleData from navigation state
    const roleData = location.state?.roleData;

    const handleClose = () => {
        // Navigate back to permission detail page
        navigate(`${ROUTES_CONSTANT.PERMISSION_DETAIL}/${id}`, {
            state: { roleData },
        });
    };

    // If no roleData, redirect to permission management
    if (!roleData) {
        navigate(ROUTES_CONSTANT.PERMISSION_MANAGEMENT);
        return null;
    }

    return (
        <DashboardContent disablePadding maxWidth={false}>
            <Column
                padding={`${pxToRem(16)} ${pxToRem(16)} ${pxToRem(20)} ${pxToRem(16)}`}
                gap={pxToRem(20)}
            >
                <FormEditRole roleData={roleData} onClose={handleClose} />
            </Column>
        </DashboardContent>
    );
}
