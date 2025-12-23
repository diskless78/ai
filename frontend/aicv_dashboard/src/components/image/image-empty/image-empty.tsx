import { Box } from '@mui/material';
import Row from 'src/components/common/row';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { pxToRem } from 'src/theme/styles';

type Props = {
  width?:
    | number
    | string
    | { xs?: string; sm?: string; md?: string; lg?: string; xl?: string }
    | undefined;
  height?:
    | number
    | string
    | { xs?: string; sm?: string; md?: string; lg?: string; xl?: string }
    | undefined;
  borderRadius?: number;
};

export default function ImageEmpty({ width, height, borderRadius }: Props) {
  return (
    <Row
      flex={1}
      width={width}
      height={height}
      border='2.5px solid'
      borderColor='neutral.20'
      bgcolor='neutral.white'
      alignItems='center'
      justifyContent='center'
      borderRadius={pxToRem(borderRadius ?? 0)}
    >
      <Box
        component='img'
        src={ASSET_CONSTANT.IMAGE.ImageEmpty}
        alt='avatar'
        sx={{ objectFit: 'cover' }}
        height='70%'
      />
    </Row>
  );
}
