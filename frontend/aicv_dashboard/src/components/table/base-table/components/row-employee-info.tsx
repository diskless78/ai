import { Typography } from '@mui/material';
import Column from 'src/components/common/column';
import Row from 'src/components/common/row';
import SizedBox from 'src/components/common/sized-box';
import BaseAvatar from 'src/components/data-display/base-avatar/base-avatar';
import { pxToRem } from 'src/theme/styles';

type Props = {
  full_name: string | null;
  avatar: string | null;
};

export default function RowEmployeeInfo({ full_name, avatar }: Props) {
  return (
    <Row py={pxToRem(8)} height={pxToRem(51)} alignItems='center'>
      <BaseAvatar size={40} src={avatar ?? ''} />
      <SizedBox width={12} />
      <Column>
        <Typography variant='t3SemiBold'>{full_name}</Typography>
      </Column>
    </Row>
  );
}
