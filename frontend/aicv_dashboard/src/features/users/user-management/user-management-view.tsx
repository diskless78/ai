import Column from 'src/components/common/column';
import { UserManagementTable } from './components/user-management-table';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { pxToRem } from 'src/theme/styles';

export function UserManagementView() {
  return (
    <DashboardContent disablePadding maxWidth={false}>
      <Column
        padding={`${pxToRem(16)} ${pxToRem(16)} ${pxToRem(20)} ${pxToRem(16)}`}
        gap={pxToRem(20)}
      >
        <UserManagementTable />
      </Column>
    </DashboardContent>
  );
}
