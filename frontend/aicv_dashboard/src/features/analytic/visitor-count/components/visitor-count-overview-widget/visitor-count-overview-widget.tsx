import React from 'react';
import { Grid } from '@mui/material';
import Column from 'src/components/common/column';
import { pxToRem } from 'src/theme/styles';
import StatCard from 'src/components/card/stat-card/stat-card';
import type { IDataOverviewResponse } from 'src/models/data-overview';
import { getLabelCompare, getRangeDateCompare } from 'src/utils/label.utils';
import type { ETimeFilterType } from 'src/models/common/models.enum';

type VisitorCountOverviewWidgetProps = {
  data?: IDataOverviewResponse;
  timeFilterType: ETimeFilterType;
};

const VisitorCountOverviewWidget: React.FC<VisitorCountOverviewWidgetProps> = ({
  data,
  timeFilterType,
}) => {
  const {
    conversion_rate,
    dwell_time,
    transaction,
    entrance_rate,
    footfall,
    passby,
  } = data || {};

  const lastLabel = getLabelCompare(timeFilterType, 'compare').toLowerCase();
  const rangeDateCompare = getRangeDateCompare({
    useTooltip: true,
    timeFilterType,
    type: 'compare',
    currentStartDate: data?.current_start_date,
    currentEndDate: data?.current_end_date,
    compareStartDate: data?.compare_start_date,
    compareEndDate: data?.compare_end_date,
  });

  return (
    <Column
      padding={pxToRem(4)}
      bgcolor='neutral.20'
      borderRadius={pxToRem(8)}
      height={{ xs: 'auto', md: pxToRem(138) }}
    >
      <Grid
        container
        rowSpacing={0}
        columnSpacing={pxToRem(2)}
        sx={{ flex: 1 }}
      >
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard
            variant='t3SemiBold'
            title='Passby'
            type='number'
            size='small'
            alignItems='left'
            value={passby?.current_value || 0}
            percentage={passby?.compare_percent || 0}
            description={`vs ${lastLabel}`}
            tooltip={rangeDateCompare}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard
            variant='t3SemiBold'
            title='Footfall'
            type='number'
            size='small'
            alignItems='left'
            value={footfall?.current_value || 0}
            percentage={footfall?.compare_percent || 0}
            description={`vs ${lastLabel}`}
            tooltip={rangeDateCompare}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard
            variant='t3SemiBold'
            title='Entrance rate'
            type='percent'
            size='small'
            alignItems='left'
            value={entrance_rate?.current_value || 0}
            percentage={entrance_rate?.compare_percent}
            description={`vs ${lastLabel}`}
            tooltip={rangeDateCompare}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard
            variant='t3SemiBold'
            title='Transaction'
            type='number'
            size='small'
            alignItems='left'
            value={transaction?.current_value || 0}
            percentage={transaction?.compare_percent || 0}
            description={`vs ${lastLabel}`}
            tooltip={rangeDateCompare}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard
            variant='t3SemiBold'
            title='Conversion rate'
            type='percent'
            size='small'
            alignItems='left'
            value={conversion_rate?.current_value || 0}
            percentage={conversion_rate?.compare_percent}
            description={`vs ${lastLabel}`}
            tooltip={rangeDateCompare}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard
            variant='t3SemiBold'
            title='Dwell time'
            type='seconds'
            size='small'
            alignItems='left'
            value={dwell_time?.current_value || 0}
            percentage={dwell_time?.compare_percent}
            description={`vs ${lastLabel}`}
            tooltip={rangeDateCompare}
          />
        </Grid>
      </Grid>
    </Column>
  );
};

export default VisitorCountOverviewWidget;
