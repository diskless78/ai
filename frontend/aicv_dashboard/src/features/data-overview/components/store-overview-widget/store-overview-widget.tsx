import React from 'react';
import { Grid, useTheme } from '@mui/material';
import Column from 'src/components/common/column';
import { pxToRem } from 'src/theme/styles';
import EntranceRateChart from './entrance-rate-chart';
import Row from 'src/components/common/row';
import EntranceRateInfo from './entrance-rate-info';
import { BaseCard } from 'src/components/card/base-card/base-card';
import type { IDataOverviewResponse } from 'src/models/data-overview';
import StatCard from 'src/components/card/stat-card/stat-card';
import { DASHBOARD_PLACEHOLDERS } from 'src/constants/app.constant';
import { getLabelCompare, getRangeDateCompare } from 'src/utils/label.utils';
import { ETimeFilterType } from 'src/models/common/models.enum';

type StoreOverviewWidgetProps = {
  data?: IDataOverviewResponse;
  timeFilterType: ETimeFilterType;
};

const StoreOverviewWidget: React.FC<StoreOverviewWidgetProps> = ({
  data,
  timeFilterType,
}) => {
  const {
    conversion_rate,
    dwell_time,
    peak_hours,
    transaction,
    entrance_rate,
    footfall,
    passby,
  } = data || {};
  const theme = useTheme();

  const labelCompare = getLabelCompare(timeFilterType, 'compare').toLowerCase();
  const rangeDateCompare = getRangeDateCompare({
    useTooltip: true,
    timeFilterType,
    type: 'compare',
    currentStartDate: data?.current_start_date,
    currentEndDate: data?.current_end_date,
    compareStartDate: data?.compare_start_date,
    compareEndDate: data?.compare_end_date,
  });

  const chartData = [footfall?.current_value || 0, passby?.current_value || 0];
  const chartLabels = ['Footfall ', 'Passby'];
  const chartPercent = [
    footfall?.compare_percent || 0,
    passby?.compare_percent || 0,
  ];

  return (
    <Column
      padding={pxToRem(4)}
      bgcolor='neutral.20'
      borderRadius={pxToRem(8)}
      height={{ xs: 'auto', md: pxToRem(291) }}
    >
      <Grid container columnSpacing={pxToRem(2)} sx={{ height: '100%' }}>
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
          <BaseCard title='Entrance rate' size='small' variant='t2SemiBold'>
            <Row
              bgcolor='neutral.0'
              flex={1}
              alignItems='center'
              justifyContent='center'
              gap={{
                md: pxToRem(20),
                lg: pxToRem(30),
                xl: pxToRem(50),
              }}
              pr={{ md: pxToRem(0), lg: pxToRem(22), xl: pxToRem(38) }}
            >
              <EntranceRateChart
                series={chartData}
                seriesPercent={chartPercent}
                labels={chartLabels}
                centerLabel='Entrance rate'
                centerValue={entrance_rate?.current_value || 0}
                percent={entrance_rate?.compare_percent || 0}
                customColors={[
                  theme.palette.purple[50],
                  theme.palette.purple[20],
                ]}
                labelCompare={labelCompare}
              />
              <EntranceRateInfo
                data={data}
                labelCompare={labelCompare}
                rangeDateCompare={rangeDateCompare}
              />
            </Row>
          </BaseCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
          <Grid
            container
            rowSpacing={0}
            columnSpacing={pxToRem(2)}
            sx={{ flex: 1 }}
          >
            <Grid size={{ xs: 12, sm: 6 }}>
              <StatCard
                variant='t2SemiBold'
                title='Transaction'
                type='number'
                value={transaction?.current_value || 0}
                percentage={transaction?.compare_percent || 0}
                description={`vs ${labelCompare}`}
                tooltip={rangeDateCompare}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <StatCard
                variant='t2SemiBold'
                title='Dwell time'
                type='seconds'
                value={dwell_time?.current_value || 0}
                percentage={dwell_time?.compare_percent}
                description={`vs ${labelCompare}`}
                tooltip={rangeDateCompare}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <StatCard
                variant='t2SemiBold'
                title='Conversion rate'
                type='percent'
                value={conversion_rate?.current_value || 0}
                percentage={conversion_rate?.compare_percent}
                description={`vs ${labelCompare}`}
                tooltip={rangeDateCompare}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <StatCard
                variant='t2SemiBold'
                title='Peak hours'
                type='label'
                value={
                  peak_hours?.label || DASHBOARD_PLACEHOLDERS.peakHoursLabel
                }
                percentage={peak_hours?.compare_percent}
                description={`vs ${labelCompare}`}
                tooltip={rangeDateCompare}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Column>
  );
};

export default React.memo(StoreOverviewWidget);
