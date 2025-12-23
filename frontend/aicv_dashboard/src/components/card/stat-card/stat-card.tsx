import Column from 'src/components/common/column';
import { BaseCard } from '../base-card/base-card';
import { pxToRem } from 'src/theme/styles';
import {
  Typography,
  type TypographyPropsVariantOverrides,
  type TypographyVariant,
} from '@mui/material';
import type { OverridableStringUnion } from '@mui/types';
import Row from 'src/components/common/row';
import PercentageChip from 'src/features/data-overview/components/percentage-chip/percentage-chip';
import { getLabelType } from 'src/utils/label.utils';
import TooltipWrapper from 'src/components/tooltip/tooltip-content/tooltip-content';

export interface IStatData {
  value: number | string;
  percentage: number;
  description?: string;
}

interface StatCardProps {
  size?: 'small' | 'medium';
  title: string;
  header?: string;
  value: string | number;
  percentage?: number;
  description?: string;
  alignItems?: 'center' | 'left';
  verticalAlign?: 'flex-start' | 'center' | 'flex-end';
  variant: OverridableStringUnion<
    TypographyVariant | 'inherit',
    TypographyPropsVariantOverrides
  >;
  type: 'label' | 'number' | 'percent' | 'seconds';
  tooltip?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  size = 'medium',
  title,
  header,
  value,
  percentage,
  description,
  alignItems,
  verticalAlign = 'center',
  variant,
  type,
  tooltip,
}) => {
  return (
    <BaseCard title={title} size='small' variant={variant}>
      <Column
        bgcolor='neutral.0'
        gap={pxToRem(4)}
        flex={1}
        alignItems={alignItems === 'left' ? 'flex-start' : 'center'}
        justifyContent={verticalAlign}
        padding={
          size === 'small'
            ? `${pxToRem(4)} ${pxToRem(8)} ${pxToRem(8)} ${pxToRem(8)}`
            : `${pxToRem(8)} ${pxToRem(16)} ${pxToRem(16)} ${pxToRem(16)}`
        }
      >
        <Column>
          {size === 'small' && header && (
            <Typography variant='t3SemiBold' color='blue.70'>
              {header ?? ''}
            </Typography>
          )}

          <Typography variant={size === 'small' ? 'h3' : 'h1'} color='blue.90'>
            {getLabelType(type, value)}
          </Typography>
        </Column>
        <Row gap={pxToRem(6)} py={pxToRem(2)}>
          <PercentageChip value={percentage ?? 0} />
          <TooltipWrapper title={tooltip} placement='bottom'>
            <Typography variant='b4Medium' color='neutral.80'>
              {description}
            </Typography>
          </TooltipWrapper>
        </Row>
      </Column>
    </BaseCard>
  );
};

export default StatCard;
