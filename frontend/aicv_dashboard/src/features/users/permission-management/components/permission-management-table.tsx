  import Row from 'src/components/common/row';
import Column from 'src/components/common/column';
import { IconButton, Typography } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import BaseTable from 'src/components/table/base-table/base-table';
import BaseButton from 'src/components/button/base-button/base-button';
import BaseIcon from 'src/components/svg/base-icon/base-icon';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import type { IBasePagingRes } from 'src/models/common/models.type';
import { BaseAccordion } from 'src/components/common/base-accordion/base-accordion';
import { useNavigate } from 'react-router-dom';
import { ROUTES_CONSTANT } from 'src/constants/routes.constant';

type PermissionAction = 'read' | 'create' | 'update' | 'delete' | 'import' | 'export';

interface IPermissionRole {
  id: string;
  role: string;
  permissions: {
    Users: {
      'User Management': PermissionAction[];
      'Permission Management': PermissionAction[];
      Branch: PermissionAction[];
      Region: PermissionAction[];
    };
    'People Counting': {
      'Data Overview': PermissionAction[];
      'Visitor traffic': PermissionAction[];
      'Zone traffic': PermissionAction[];
      'Transaction and Interaction': PermissionAction[];
    };
    Settings: {
      'User Management': PermissionAction[];
      'Profile Management': PermissionAction[];
    };
  };
}

export function PermissionManagementTable() {
  const navigate = useNavigate();
  
  const handleRowClick = (roleData: IPermissionRole) => {
    navigate(`${ROUTES_CONSTANT.PERMISSION_DETAIL}/${roleData.id}`, {
      state: { roleData },
    });
  };

  // Mock data - replace with actual API call
  const mockData: IBasePagingRes<IPermissionRole> = {
    items: [
      {
        id: '1',
        role: 'Administrator',
        permissions: {
          Users: {
            'User Management': ['read', 'create', 'update', 'delete'],
            'Permission Management': ['read', 'create', 'update', 'delete'],
            Branch: ['read', 'import', 'update'],
            Region: ['read', 'create', 'update', 'delete', 'import', 'export'],
          },
          'People Counting': {
            'Data Overview': ['read', 'export'],
            'Visitor traffic': ['read', 'export'],
            'Zone traffic': ['read', 'export'],
            'Transaction and Interaction': ['read', 'export'],
          },
          Settings: {
            'User Management': ['read', 'export'],
            'Profile Management': ['read', 'export'],
          },
        },
      },
      {
        id: '2',
        role: 'Editor',
        permissions: {
          Users: {
            'User Management': ['read', 'update'],
            'Permission Management': ['read'],
            Branch: ['read', 'update'],
            Region: ['read', 'update'],
          },
          'People Counting': {
            'Data Overview': ['read'],
            'Visitor traffic': ['read'],
            'Zone traffic': ['read'],
            'Transaction and Interaction': [],
          },
          Settings: {
            'User Management': ['read'],
            'Profile Management': [],
          },
        },
      },
      {
        id: '3',
        role: 'Viewer',
        permissions: {
          Users: {
            'User Management': ['read'],
            'Permission Management': ['read'],
            Branch: [],
            Region: [],
          },
          'People Counting': {
            'Data Overview': ['read'],
            'Visitor traffic': ['read'],
            'Zone traffic': ['read'],
            'Transaction and Interaction': [],
          },
          Settings: {
            'User Management': ['read'],
            'Profile Management': [],
          },
        },
      },
      {
        id: '4',
        role: 'Manager',
        permissions: {
          Users: {
            'User Management': ['read', 'create', 'update'],
            'Permission Management': ['read'],
            Branch: [],
            Region: [],
          },
          'People Counting': {
            'Data Overview': ['read', 'export'],
            'Visitor traffic': ['read', 'export'],
            'Zone traffic': ['read', 'export'],
            'Transaction and Interaction': [],
          },
          Settings: {
            'User Management': ['read', 'export'],
            'Profile Management': [],
          },
        },
      },
      {
        id: '5',
        role: 'Analyst',
        permissions: {
          Users: {
            'User Management': ['read'],
            'Permission Management': [],
            Branch: [],
            Region: [],
          },
          'People Counting': {
            'Data Overview': ['read', 'export'],
            'Visitor traffic': ['read', 'export'],
            'Zone traffic': ['read', 'export'],
            'Transaction and Interaction': ['read', 'export'],
          },
          Settings: {
            'User Management': [],
            'Profile Management': [],
          },
        },
      },
      {
        id: '6',
        role: 'Support',
        permissions: {
          Users: {
            'User Management': ['read'],
            'Permission Management': ['read'],
            Branch: [],
            Region: [],
          },
          'People Counting': {
            'Data Overview': ['read'],
            'Visitor traffic': ['read'],
            'Zone traffic': ['read'],
            'Transaction and Interaction': [],
          },
          Settings: {
            'User Management': ['read'],
            'Profile Management': [],
          },
        },
      },
    ],
    page: 1,
    page_size: 6,
    total: 6,
    is_full: false,
  };

  return (
    <Column gap={pxToRem(20)}>
      <Row alignItems='center' justifyContent='space-between'>
        <Typography variant='h3' color='neutral.999'>
          Permission Management
        </Typography>
        <BaseButton
          text='Create new role'
          size='medium'
          onClick={() => navigate(ROUTES_CONSTANT.CREATE_ROLE)}
          iconLeft={
            <BaseIcon
              size={20}
              src={ASSET_CONSTANT.SVG.IconLinearPlus}
              color='white'
            />
          }
        />
      </Row>

      <BaseAccordion>
        <BaseTable<IPermissionRole>
          showIndex={true}
          data={mockData}
          headersTable={[
            {
              title: 'Role',
              field: 'role',
              align: 'center',
              renderItem: (data) => (
                <Typography
                  variant='t2SemiBold'
                  color='neutral.100'
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleRowClick(data)}
                >
                  {data.role}
                </Typography>
              ),
            },
            {
              title: 'Action',
              align: 'center',
              width: 120,
              renderItem: (data) => (
                <Row
                  gap={pxToRem(8)}
                  justifyContent='center'
                  alignItems='center'
                >
                  <IconButton onClick={() => handleRowClick(data)}>
                    <BaseIcon
                      size={24}
                      src={ASSET_CONSTANT.SVG.IconLinearEdit}
                      color='neutral.50'
                    />
                  </IconButton>
                  <IconButton>
                    <BaseIcon
                      size={24}
                      src={ASSET_CONSTANT.SVG.IconLinearTrash}
                      color='orange.70'
                    />
                  </IconButton>
                </Row>
              ),
            },
          ]}
          heightRow={56}
          placeholder='No roles available'
        />
      </BaseAccordion>
    </Column>
  );
}
