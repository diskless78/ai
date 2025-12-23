import BaseButton from 'src/components/button/base-button/base-button';
import Column from 'src/components/common/column';
import Row from 'src/components/common/row';
import FormInputText from 'src/components/input/form-input-text/form-input-text';
import { pxToRem } from 'src/theme/styles';
import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import type { IPermissionData } from './types';
import { PermissionMatrix } from './permission-matrix';
import { toggleMessage } from 'src/components/toast/toast/toast';
import { useAppDispatch } from 'src/store';
import { setOpenNotifyModal } from 'src/store/slices/notify.slice';
import BaseBreadcrumb from 'src/components/common/base-breadcrumb';
import { FEATURE } from 'src/constants/feature-constant';

const defaultPermissions: IPermissionData = {
  Users: {
    'User Management': [],
    'Permission Management': [],
    Branch: [],
    Region: [],
  },
  'People Counting': {
    'Data Overview': [],
    'Visitor traffic': [],
    'Zone traffic': [],
    'Transaction and Interaction': [],
  },
  Settings: {
    'User Management': [],
    'Profile Management': [],
  },
};

interface FormCreateRoleProps {
  onClose: () => void;
}

interface IFormInput {
  roleName: string;
}

export function FormCreateRole({ onClose }: FormCreateRoleProps) {
  const dispatch = useAppDispatch();
  const [hasChanges, setHasChanges] = useState(false);
  const [initialPermissions] = useState<IPermissionData>(
    JSON.parse(JSON.stringify(defaultPermissions))
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
      roleName: '',
    },
    resolver: yupResolver(validationSchema),
  });
  const [permissions, setPermissions] = useState<IPermissionData>(
    JSON.parse(JSON.stringify(defaultPermissions))
  );

  const roleName = watch('roleName');

  // Track if permissions or role name have changed from initial state
  useEffect(() => {
    const permissionsChanged =
      JSON.stringify(permissions) !== JSON.stringify(initialPermissions);
    const roleNameChanged = roleName.trim() !== '';
    setHasChanges(permissionsChanged || roleNameChanged);
  }, [permissions, initialPermissions, roleName]);

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
        message: 'The create operation was canceled.',
        });
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log('Save role:', { roleName: data.roleName, permissions });

    // Show success notification
    toggleMessage({
      type: 'success',
      message: `The ${data.roleName} role has been created.`,
    });
    onClose();
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
              title: FEATURE.CREATE_ROLE.title,
              path: FEATURE.CREATE_ROLE.path,
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
