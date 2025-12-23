import BaseButton from 'src/components/button/base-button/base-button';
import Column from 'src/components/common/column';
import Row from 'src/components/common/row';
import FormInputText from 'src/components/input/form-input-text/form-input-text';
import { pxToRem } from 'src/theme/styles';
import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import type { IPermissionData } from 'src/features/users/create-permission/components/form-create-role/types';
import { PermissionMatrix } from 'src/features/users/create-permission/components/form-create-role/permission-matrix';
import { toggleMessage } from 'src/components/toast/toast/toast';
import { useAppDispatch } from 'src/store';
import { setOpenNotifyModal } from 'src/store/slices/notify.slice';
import BaseBreadcrumb from 'src/components/common/base-breadcrumb';
import { FEATURE } from 'src/constants/feature-constant';

interface FormEditRoleProps {
    roleData: {
        id: string;
        role: string;
        permissions: IPermissionData;
    };
    onClose: () => void;
}

interface IFormInput {
    roleName: string;
}

export function FormEditRole({ roleData, onClose }: FormEditRoleProps) {
    const dispatch = useAppDispatch();
    const [hasChanges, setHasChanges] = useState(false);

    // Use permissions directly as they're already in array format
    const [initialPermissionsState] = useState<IPermissionData>(
        JSON.parse(JSON.stringify(roleData.permissions))
    );

    const validationSchema = Yup.object().shape({
        roleName: Yup.string().required('This role name field is required'),
    });

    const {
        control,
        formState: { errors },
        handleSubmit,
        watch,
    } = useForm<IFormInput>({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            roleName: roleData.role,
        },
        resolver: yupResolver(validationSchema),
    });

    const [permissions, setPermissions] = useState<IPermissionData>(
        JSON.parse(JSON.stringify(roleData.permissions))
    );

    const roleName = watch('roleName');

    // Track if permissions or role name have changed from initial state
    useEffect(() => {
        const permissionsChanged =
            JSON.stringify(permissions) !== JSON.stringify(initialPermissionsState);
        const roleNameChanged = roleName.trim() !== roleData.role;
        setHasChanges(permissionsChanged || roleNameChanged);
    }, [permissions, initialPermissionsState, roleName, roleData.role]);

    const handleCancel = () => {
        if (hasChanges) {
            dispatch(
                setOpenNotifyModal({
                    open: true,
                    title: 'Confirm cancellation',
                    content:
                        'If you cancel. The changes you are making will not be saved.',
                    type: 'caution',
                    textConfirm: 'Done',
                    onConfirm: () => {
                        onClose();
                    },
                })
            );
        } else {
            onClose();
            toggleMessage({
                type: 'info',
                message: 'The edit operation was canceled.',
            });
        }
    };

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        console.log('Update role:', {
            id: roleData.id,
            roleName: data.roleName,
            permissions,
        });

        // Show success notification
        if (hasChanges) {
            dispatch(
                setOpenNotifyModal({
                    open: true,
                    title: 'Confirm save',
                    content:
                        `Be sure to save changes to this ${data.roleName}. This change cannot be undone.`,
                    type: 'confirm',
                    textConfirm: 'Save',
                    onConfirm: () => {
                        onClose();
                        toggleMessage({
                            type: 'success',
                            message: `The ${data.roleName} role has been updated.`,
                        });
                    },
                })
            );   
        }
    };

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
                        text='Cancel'
                        size='medium'
                        color='secondary'
                        onClick={handleCancel}
                    />
                    <BaseButton
                        text='Save'
                        size='medium'
                        onClick={handleSubmit(onSubmit)}
                    />
                </Row>
            </Row>

            {/* Role Name Input */}
            <Row>
                <FormInputText
                    name='roleName'
                    label='Role name'
                    required
                    control={control}
                    placeholder='Administrator'
                    width='400px'
                    errors={errors}
                />
            </Row>

            {/* Permission Matrix */}
            <PermissionMatrix data={permissions} onDataChange={setPermissions} />
        </Column>
    );
}
