import { Typography } from '@mui/material';
import Row from 'src/components/common/row';
import BaseIcon from 'src/components/svg/base-icon/base-icon';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { pxToRem } from 'src/theme/styles';
import { formatNumber } from 'src/utils/format-number';

interface BaseChipProps {
  value: number;
  color: 'green' | 'red' | 'blue' | 'grey';
}

const BaseChip: React.FC<BaseChipProps> = ({ value, color = 'blue' }) => {
  const bgColor =
    color === 'green'
      ? 'green.10'
      : color === 'red'
        ? 'red.10'
        : color === 'grey'
          ? 'neutral.20'
          : 'blue.10';

  const textColor =
    color === 'green'
      ? 'green.90'
      : color === 'red'
        ? 'red.90'
        : color === 'grey'
          ? 'neutral.70'
          : 'blue.90';

  return (
    <Row
      alignItems='center'
      gap={pxToRem(1)}
      bgcolor={bgColor}
      p={`${pxToRem(1)} ${pxToRem(4)}`}
      borderRadius={pxToRem(3)}
      display='inline-flex'
    >
      {(color === 'green' || color === 'red') && (
        <BaseIcon
          src={
            color === 'green'
              ? ASSET_CONSTANT.SVG.IconLinearArrowUpRight
              : ASSET_CONSTANT.SVG.IconLinearArrowDownRight
          }
          size={12}
          color={textColor}
        />
      )}
      <Typography variant='b4Medium' color={textColor}>
        {formatNumber(value)}%
      </Typography>
    </Row>
  );
};

export default BaseChip;
