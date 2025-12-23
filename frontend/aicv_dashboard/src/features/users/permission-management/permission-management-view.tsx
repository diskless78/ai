import Column from 'src/components/common/column';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { pxToRem } from 'src/theme/styles';
import { PermissionManagementTable } from './components/permission-management-table';

export function PermissionManagementView() {
  return (
    <DashboardContent disablePadding maxWidth={false}>
      <Column
        padding={`${pxToRem(16)} ${pxToRem(16)} ${pxToRem(20)} ${pxToRem(16)}`}
        gap={pxToRem(20)}
      >
        <PermissionManagementTable />
      </Column>
    </DashboardContent>
  );
}
