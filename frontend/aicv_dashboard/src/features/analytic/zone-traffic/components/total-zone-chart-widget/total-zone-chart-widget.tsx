import { Typography, useTheme } from '@mui/material';
import { useState, useMemo } from 'react';
import TotalZoneChart, { type ZoneSeries } from './total-zone-chart';
import Column from 'src/components/common/column';
import Row from 'src/components/common/row';
import BaseTooltip from 'src/components/tooltip/base-tooltip/base-tooltip';
import { pxToRem } from 'src/theme/styles';
import { ETimeFilterType } from 'src/models/common/models.enum';
import { useTotalZoneChart } from 'src/features/analytic/hooks/use-analytics-service';
import type { ISelectDateValue } from 'src/components/input/input-select-date/types';
import dayjs from 'dayjs';
import type { ITotalZoneChartRequest } from 'src/models/analystics';
import InputSelectDate from 'src/components/input/input-select-date/input-select-date';

const TotalZoneChartWidget: React.FC = () => {
  const theme = useTheme();
  const [selectDate, setSelectDate] = useState<ISelectDateValue>({
    timeFilterType: ETimeFilterType.Today,
    startDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
  });

  const totalZoneChartRequest: ITotalZoneChartRequest = {
    time_filter_type: selectDate.timeFilterType,
    start_date: selectDate.startDate,
    end_date: selectDate.endDate,
  };

  const { data: totalZoneChart } = useTotalZoneChart(totalZoneChartRequest);

  const chartColors = useMemo(
    () => [
      theme.palette.purple[20],
      theme.palette.purple[50],
      theme.palette.purple[70],
      theme.palette.neutral[40],
      theme.palette.neutral[20],
      theme.palette.orange[20],
    ],
    [theme]
  );

  const categories = useMemo(
    () => totalZoneChart?.labels || [],
    [totalZoneChart]
  );

  const series: ZoneSeries[] = useMemo(
    () =>
      totalZoneChart?.data.map((item) => ({
        id: item.zone_id,
        name: item.zone_name,
        data: item.values.map((value) => value.current_value),
        percent: item.values.map((value) => value.compare_percent),
      })) || [],
    [totalZoneChart]
  );

  return (
    <Column>
      <Row
        alignItems='center'
        justifyContent='space-between'
        padding={`${pxToRem(5)} ${pxToRem(4)}`}
      >
        <Row alignItems='center' gap={pxToRem(6)}>
          <Typography variant='t1SemiBold' color='neutral.100'>
            Total Zone Chart
          </Typography>
          <BaseTooltip title='' size='small' />
        </Row>

        <InputSelectDate
          value={selectDate}
          onChangeValue={(value) => setSelectDate(value)}
          placeholder='Select date range'
          width={pxToRem(240)}
        />
      </Row>

      <TotalZoneChart
        categories={categories}
        series={series}
        colors={chartColors}
      />
    </Column>
  );
};

export default TotalZoneChartWidget;
