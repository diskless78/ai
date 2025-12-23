import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Column from 'src/components/common/column';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { pxToRem } from 'src/theme/styles';
import { FormViewRole } from './components/form-view-role/form-view-role';
import { ROUTES_CONSTANT } from 'src/constants/routes.constant';

export function PermissionView() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    // Get roleData from navigation state
    const roleData = location.state?.roleData;

    const handleEdit = () => {
        navigate(`${ROUTES_CONSTANT.EDIT_ROLE}/${id}`, {
            state: { roleData },
        });
    };

    // If no roleData, redirect back
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
                <FormViewRole roleData={roleData} onEdit={handleEdit} />
            </Column>
        </DashboardContent>
    );
}
