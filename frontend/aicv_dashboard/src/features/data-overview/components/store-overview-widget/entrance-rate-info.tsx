import React from 'react';
import { Box, Typography } from '@mui/material';
import SizedBox from 'src/components/common/sized-box';
import Row from 'src/components/common/row';
import PercentageChip from '../percentage-chip/percentage-chip';
import { pxToRem } from 'src/theme/styles';
import Column from 'src/components/common/column';
import type { IDataOverviewResponse } from 'src/models/data-overview';
import { formatNumber } from 'src/utils/format-number';
import TooltipWrapper from 'src/components/tooltip/tooltip-content/tooltip-content';

interface StatsItemProps {
  label: string;
  value: number;
  change: number;
  color: string;
  description: string;
  tooltip?: string;
}

const StatsItem: React.FC<StatsItemProps> = ({
  label,
  value,
  change,
  color,
  description,
  tooltip,
}) => {
  return (
    <Column gap={pxToRem(4)} py={pxToRem(4)}>
      <Row alignItems='center' gap={pxToRem(8)}>
        <Box
          sx={{
            width: 9,
            height: 9,
            borderRadius: '50%',
            backgroundColor: color,
          }}
        />
        <Typography variant='b3Medium' color='neutral.999'>
          {label}:{' '}
          <Typography component='span' variant='b1Regular' color='neutral.999'>
            {formatNumber(value)}
          </Typography>
        </Typography>
      </Row>

      <Row gap={pxToRem(6)}>
        <PercentageChip value={change ?? 0} />
        <TooltipWrapper title={tooltip} placement='bottom'>
          <Typography variant='b4Medium' color='neutral.80'>
            {description}
          </Typography>
        </TooltipWrapper>
      </Row>
    </Column>
  );
};

interface EntranceRateInfoProps {
  data?: IDataOverviewResponse;
  labelCompare: string;
  rangeDateCompare: string;
}

const EntranceRateInfo: React.FC<EntranceRateInfoProps> = ({
  data,
  labelCompare,
  rangeDateCompare,
}) => {
  const { passby, footfall, total_traffic } = data || {};

  return (
    <Column minWidth={pxToRem(160)}>
      <StatsItem
        label='Passby'
        value={passby?.current_value || 0}
        change={passby?.compare_percent || 0}
        color='purple.20'
        description={`vs ${labelCompare}`}
        tooltip={rangeDateCompare}
      />
      <SizedBox height={6} />
      <StatsItem
        label='Footfall'
        value={footfall?.current_value || 0}
        change={footfall?.compare_percent || 0}
        color='purple.50'
        description={`vs ${labelCompare}`}
        tooltip={rangeDateCompare}
      />
      <SizedBox height={12} />
      <Typography variant='t2SemiBold'>
        Total: {formatNumber(total_traffic?.current_value || 0)}
      </Typography>
    </Column>
  );
};

export default EntranceRateInfo;
