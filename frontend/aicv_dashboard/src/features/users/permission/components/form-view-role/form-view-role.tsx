import BaseButton from 'src/components/button/base-button/base-button';
import Column from 'src/components/common/column';
import Row from 'src/components/common/row';
import { pxToRem } from 'src/theme/styles';
import type { IPermissionData } from 'src/features/users/create-permission/components/form-create-role/types';
import { PermissionMatrixReadOnly } from './permission-matrix-readonly';
import BaseBreadcrumb from 'src/components/common/base-breadcrumb';
import { FEATURE } from 'src/constants/feature-constant';

interface FormViewRoleProps {
    roleData: {
        id: string;
        role: string;
        permissions: IPermissionData;
    };
    onEdit: () => void;
}

export function FormViewRole({ roleData, onEdit }: FormViewRoleProps) {
    return (
        <Column gap={pxToRem(20)}>
            <Row alignItems='center' justifyContent='space-between'>
                <BaseBreadcrumb
                    items={[
                        {
                            title: FEATURE.PERMISSION_MANAGEMENT.title,
                            path: FEATURE.PERMISSION_MANAGEMENT.path,
                        },
                        {
                            title: roleData.role,
                            path: `${FEATURE.PERMISSION_MANAGEMENT.path}/permission/${roleData.id}`,
                        },
                    ]}
                />
                <Row gap={pxToRem(12)}>
                    <BaseButton
                        text='Update'
                        size='medium'
                        onClick={onEdit}
                    />
                </Row>
            </Row>

            {/* Permission Matrix (Read-only) */}
            <PermissionMatrixReadOnly data={roleData.permissions} />
        </Column>
    );
}
