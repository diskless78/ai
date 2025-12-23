import React from 'react';
import { Grid } from '@mui/material';
import Column from 'src/components/common/column';
import { pxToRem } from 'src/theme/styles';
import StatCard from 'src/components/card/stat-card/stat-card';
import type { IZoneTrafficOverviewData } from 'src/models/analystics';

type ZoneTrafficOverviewWidgetProps = {
  data?: IZoneTrafficOverviewData;
};

const ZoneTrafficOverviewWidget: React.FC<ZoneTrafficOverviewWidgetProps> = ({
  data,
}) => {
  const {
    dwell_time,
    longest_zone_stay,
    shortest_zone_stay,
    peak_dwell_hour,
    most_crowded_zone,
    least_crowded_zone,
  } = data || {};

  return (
    <Column
      padding={pxToRem(4)}
      bgcolor='neutral.20'
      borderRadius={pxToRem(8)}
      height={{ xs: 'auto', md: pxToRem(150) }}
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
            title='Dwell time'
            type='seconds'
            size='small'
            alignItems='left'
            verticalAlign='flex-end'
            value={dwell_time?.current_value || 0}
            percentage={dwell_time?.compare_percent || 0}
            description={'vs yesterday'}
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard
            variant='t3SemiBold'
            title='Longest zone stay'
            type='seconds'
            size='small'
            alignItems='left'
            verticalAlign='flex-end'
            header={longest_zone_stay?.zone_name || ''}
            value={longest_zone_stay?.data.current_value || 0}
            percentage={longest_zone_stay?.data.compare_percent || 0}
            description={'vs yesterday'}
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard
            variant='t3SemiBold'
            title='Shortest zone stay'
            type='seconds'
            size='small'
            alignItems='left'
            verticalAlign='flex-end'
            header={shortest_zone_stay?.zone_name || ''}
            value={shortest_zone_stay?.data.current_value || 0}
            percentage={shortest_zone_stay?.data.compare_percent || 0}
            description={'vs yesterday'}
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard
            variant='t3SemiBold'
            title='Peak dwell hour'
            type='label'
            size='small'
            alignItems='left'
            verticalAlign='flex-end'
            header={peak_dwell_hour?.zone_name || ''}
            value={peak_dwell_hour?.data.label || ''}
            percentage={peak_dwell_hour?.data.compare_percent || 0}
            description={'vs yesterday'}
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard
            variant='t3SemiBold'
            title='Most Crowded Zone'
            type='number'
            size='small'
            alignItems='left'
            verticalAlign='flex-end'
            header={most_crowded_zone?.zone_name || ''}
            value={most_crowded_zone?.data.current_value || 0}
            percentage={most_crowded_zone?.data.compare_percent || 0}
            description={'vs yesterday'}
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard
            variant='t3SemiBold'
            title='Least Crowded Zone'
            type='number'
            size='small'
            alignItems='left'
            verticalAlign='flex-end'
            header={least_crowded_zone?.zone_name || ''}
            value={least_crowded_zone?.data.current_value || 0}
            percentage={least_crowded_zone?.data.compare_percent || 0}
            description={'vs yesterday'}
          />
        </Grid>
      </Grid>
    </Column>
  );
};

export default ZoneTrafficOverviewWidget;
