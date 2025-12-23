import React from 'react';
import { Typography } from '@mui/material';
import { SvgColor } from '../svg/svg-color';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import LegendLineDashCircle from '../svg/svg-custom/legend-line-dash-circle';
import LegendLineCircle from '../svg/svg-custom/legend-line-circle';
import Row from '../common/row';
import { pxToRem } from 'src/theme/styles';

type LegendType = 'bar' | 'line' | 'line-dash';

interface BaseLegendProps {
  type: LegendType;
  color: string;
  title: string;
}

const BaseLegend: React.FC<BaseLegendProps> = ({ type, color, title }) => {
  return (
    <Row
      alignItems='center'
      gap={pxToRem(8)}
      padding={`${pxToRem(5)} ${pxToRem(4)} ${pxToRem(5)} ${pxToRem(12)}`}
    >
      {type === 'bar' && (
        <SvgColor
          src={ASSET_CONSTANT.SVG.LegendBar}
          width={36}
          height={9}
          color={color}
        />
      )}

      {type === 'line' && <LegendLineCircle sx={{ color }} />}

      {type === 'line-dash' && <LegendLineDashCircle sx={{ color }} />}

      <Typography variant='b4Medium' color='neutral.100'>
        {title}
      </Typography>
    </Row>
  );
};

export default BaseLegend;
