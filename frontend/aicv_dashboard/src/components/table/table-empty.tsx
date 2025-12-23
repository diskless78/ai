import { Box, Typography } from '@mui/material';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { pxToRem } from 'src/theme/styles';
import Column from '../common/column';

type Props = {
  label?: string;
};

export default function TableEmpty({ label }: Props) {
  return (
    <Column
      paddingTop={pxToRem(30)}
      alignItems='center'
      justifyContent='center'
      height={pxToRem(300)}
      gap={pxToRem(30)}
      width='100%'
    >
      <Box
        component='img'
        src={ASSET_CONSTANT.IMAGE.NotFindMediaData}
        alt='avatar'
        sx={{ objectFit: 'cover' }}
        width={pxToRem(225 * 0.75)}
        height={pxToRem(180 * 0.75)}
      />
      <Typography variant='t2SemiBold' color='purple.100'>
        {label ?? 'Không có dữ liệu'}
      </Typography>
    </Column>
  );
}
