import { Typography } from '@mui/material';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { pxToRem } from 'src/theme/styles';
import { SvgColor } from '../svg/svg-color';
import Row from './row';

type Props = {
  message?: string;
};

export default function FormError({ message }: Props) {
  return (
    <Row gap={pxToRem(4)} mt={pxToRem(4)} style={{ alignItems: 'center' }}>
      <SvgColor
        width={pxToRem(20)}
        height={pxToRem(20)}
        color='orange.70'
        src={ASSET_CONSTANT.SVG.IconLinearCaution}
      />
      <Typography variant='b3Medium' style={{ alignItems: 'center' }}>
        {message ?? ''}
      </Typography>
    </Row>
  );
}
