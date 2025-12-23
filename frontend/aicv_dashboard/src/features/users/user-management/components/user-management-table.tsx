import { IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseButton from 'src/components/button/base-button/base-button';
import { BaseAccordion } from 'src/components/common/base-accordion/base-accordion';
import Column from 'src/components/common/column';
import Row from 'src/components/common/row';
import BaseSwitch from 'src/components/controls/base-switch';
import BaseIcon from 'src/components/svg/base-icon/base-icon';
import { BaseTable } from 'src/components/table/base-table';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { ROUTES_CONSTANT } from 'src/constants/routes.constant';
import type { IBasePagingRes } from 'src/models/common/models.type';
import { pxToRem } from 'src/theme/styles';

interface IUser {
  id: string;
  accountName: string;
  email: string;
  role: string;
  isActive: boolean;
}

export function UserManagementTable() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<IUser[]>([
    {
      id: '1',
      accountName: 'Joseph Đoàn',
      email: 'nghia.doantrong@cxview.ai',
      role: 'Administrator',
      isActive: true,
    },
    {
      id: '3',
      accountName: 'Sophia Martinez',
      email: 'sophia.martinez@example.com',
      role: 'Administrator',
      isActive: true,
    },
    {
      id: '4',
      accountName: "Liam O'Connor",
      email: 'liam.oconnor@example.com',
      role: 'Administrator',
      isActive: true,
    },
    {
      id: '5',
      accountName: 'Ava Chen',
      email: 'ava.chen@example.com',
      role: 'Administrator',
      isActive: true,
    },
    {
      id: '6',
      accountName: 'Ethan Roberts',
      email: 'ethan.roberts@example.com',
      role: 'Administrator',
      isActive: false,
    },
    {
      id: '7',
      accountName: 'Mia Johnson',
      email: 'mia.johnson@example.com',
      role: 'Data Analyst',
      isActive: true,
    },
    {
      id: '8',
      accountName: 'Noah Smith',
      email: 'noah.smith@example.com',
      role: 'Administrator',
      isActive: true,
    },
    {
      id: '9',
      accountName: 'Isabella Garcia',
      email: 'isabella.garcia@example.com',
      role: 'Administrator',
      isActive: true,
    },
    {
      id: '10',
      accountName: 'Lucas Brown',
      email: 'lucas.brown@example.com',
      role: 'Customer Support',
      isActive: true,
    },
    {
      id: '11',
      accountName: 'Emma Wilson',
      email: 'emma.wilson@example.com',
      role: 'QA Tester',
      isActive: true,
    },
    {
      id: '12',
      accountName: 'Oliver Davis',
      email: 'oliver.davis@example.com',
      role: 'Administrator',
      isActive: true,
    },
    {
      id: '13',
      accountName: 'Charlotte Lee',
      email: 'charlotte.lee@example.com',
      role: 'Data Analyst',
      isActive: false,
    },
    {
      id: '14',
      accountName: 'James Taylor',
      email: 'james.taylor@example.com',
      role: 'Administrator',
      isActive: true,
    },
    {
      id: '15',
      accountName: 'Amelia White',
      email: 'amelia.white@example.com',
      role: 'Customer Support',
      isActive: true,
    },
  ]);

  const handleToggleActive = (userId: string, isActive: boolean) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isActive } : user
      )
    );
  };

  const mockData: IBasePagingRes<IUser> = {
    items: users,
    page: 1,
    page_size: 5,
    total: 14,
    is_full: false,
  };

  return (
    <Column gap={pxToRem(20)}>
      <Row justifyContent='space-between' alignItems='center'>
        <Typography variant='h3'>User Management</Typography>
        <Row gap={pxToRem(8)}>
          <BaseButton
            text='Create new user'
            size='medium'
            iconLeft={
              <BaseIcon
                size={20}
                src={ASSET_CONSTANT.SVG.IconLinearPlus}
                color='white'
              />
            }
            onClick={() => navigate(ROUTES_CONSTANT.CREATE_USER)}
          />
        </Row>
      </Row>
      <BaseAccordion>
        <BaseTable<IUser>
          showIndex={true}
          data={mockData}
          headersTable={[
            {
              title: 'Account name',
              field: 'accountName',
              align: 'center',
            },
            {
              title: 'Email',
              field: 'email',
              align: 'center',
            },
            {
              title: 'Role',
              field: 'role',
              align: 'center',
            },
            {
              title: 'Activate',
              align: 'center',
              width: 120,
              renderItem: (user) => (
                <BaseSwitch
                  size='small'
                  checked={user.isActive}
                  onChange={(checked) => handleToggleActive(user.id, checked)}
                />
              ),
            },
            {
              title: 'Action',
              align: 'center',
              width: 120,
              renderItem: () => (
                <Row
                  gap={pxToRem(8)}
                  justifyContent='center'
                  alignItems='center'
                >
                  <IconButton>
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
          placeholder='No users available'
        />
      </BaseAccordion>
    </Column>
  );
}
