import Row from 'src/components/common/row';
import Column from 'src/components/common/column';
import { Grid, Typography, useTheme } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import SizedBox from 'src/components/common/sized-box';
import BaseTooltip from 'src/components/tooltip/base-tooltip/base-tooltip';
import InputSelect from 'src/components/input/input-select/input-select';
import HorizontalBarChart from './components/horizontal-bar-chart/horizontal-bar-chart';
import { SELECT_TOP_DATA, SELECT_TRAFFIC_DATA } from 'src/_mock/_data';
import { ETimeFilterType, ETrafficType } from 'src/models/common/models.enum';
import { useMemo, useState } from 'react';
import type { ITopStoreRequest } from 'src/models/analystics';
import TopStoreTable from './components/top-store-table';
import { useTopStore } from '../../../hooks/use-analytics-service';
import dayjs from 'dayjs';
import type { ISelectDateValue } from 'src/components/input/input-select-date/types';
import InputSelectDate from 'src/components/input/input-select-date/input-select-date';
import { getRangeDateCompare } from 'src/utils/label.utils';

const TopStoreWidget: React.FC = () => {
  const theme = useTheme();

  const [trafficType, setTrafficType] = useState<ETrafficType>(
    ETrafficType.Footfall
  );
  const [selectDate, setSelectDate] = useState<ISelectDateValue>({
    timeFilterType: ETimeFilterType.Today,
    startDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
  });
  const [topData, setTopData] = useState('10');

  const topStoreRequest: ITopStoreRequest = useMemo(
    () => ({
      type: trafficType,
      time_filter_type: selectDate.timeFilterType,
      page_size: Number(topData),
      start_date: selectDate.startDate,
      end_date: selectDate.endDate,
    }),
    [selectDate, trafficType, topData]
  );

  const { data: topStore } = useTopStore(topStoreRequest);

  const categories = topStore?.chart_data.map((item) => item.group_name) || [];
  const series = [
    {
      name: 'Value',
      data: topStore?.chart_data.map((item) => item.current_value) || [],
      percent: topStore?.chart_data.map((item) => item.compare_percent) || [],
    },
  ];

  const labelCompare = `compare to ${getRangeDateCompare({
    timeFilterType: selectDate.timeFilterType,
    type: 'compare',
    breakLine: true,
    currentStartDate: topStore?.current_start_date,
    currentEndDate: topStore?.current_end_date,
    compareStartDate: topStore?.compare_start_date,
    compareEndDate: topStore?.compare_end_date,
  }).toLowerCase()}`;

  return (
    <Column>
      <Row
        alignItems='center'
        justifyContent='space-between'
        padding={`${pxToRem(8)} ${pxToRem(4)}`}
      >
        <Row alignItems='center' gap={pxToRem(6)}>
          <Typography variant='t1SemiBold' color='neutral.100'>
            Top 10 Store
          </Typography>
          <BaseTooltip title='' size='small' />
        </Row>
        <Row gap={pxToRem(8)}>
          <InputSelectDate
            value={selectDate}
            onChangeValue={(value) => setSelectDate(value)}
            placeholder='Select date range'
            width={pxToRem(240)}
          />
          <InputSelect
            value={trafficType}
            list={SELECT_TRAFFIC_DATA}
            onChangeValue={(value) => setTrafficType(value as ETrafficType)}
          />
          <InputSelect
            value={topData}
            list={SELECT_TOP_DATA}
            onChangeValue={(value) => setTopData(value)}
          />
        </Row>
      </Row>
      <SizedBox height={8} />
      <Grid container spacing={2}>
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <HorizontalBarChart
            categories={categories}
            series={series}
            color={theme.palette.blue[70]}
            labelCompare={labelCompare}
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <TopStoreTable data={topStore?.total_all_store} />
        </Grid>
      </Grid>
    </Column>
  );
};

export default TopStoreWidget;
