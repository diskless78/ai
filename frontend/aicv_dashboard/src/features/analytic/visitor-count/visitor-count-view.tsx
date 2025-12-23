import { Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import Column from 'src/components/common/column';
import Row from 'src/components/common/row';
import InputSelect from 'src/components/input/input-select/input-select';
import { SvgColor } from 'src/components/svg/svg-color';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { FEATURE } from 'src/constants/feature-constant';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { ETimeFilterType, ETrafficType } from 'src/models/common/models.enum';
import type {
  IDataOverviewRequest,
  ITrafficChartRequest,
} from 'src/models/data-overview';
import { useAppSelector } from 'src/store';
import { selectGroup } from 'src/store/selectors/system.selectors';
import { pxToRem } from 'src/theme/styles';
import SummaryTableWidget from './components/summary-table-widget/summary-table-widget';
import VisitorCountOverviewWidget from './components/visitor-count-overview-widget/visitor-count-overview-widget';
import TopStoreWidget from './components/top-store-widget/top-store-widget';
import {
  useDataOverview,
  useTrafficChart,
  useExportTrafficChart,
} from 'src/features/data-overview/hooks/use-data-overview-service';
import { useSummaryTable } from '../hooks/use-analytics-service';
import type { ISelectDateValue } from 'src/components/input/input-select-date/types';
import dayjs from 'dayjs';
import InputSelectDate from 'src/components/input/input-select-date/input-select-date';
import TrafficChartWidget from 'src/features/data-overview/components/traffic-chart-widget/traffic-chart-widget';
import StoreTrafficTrendWidget from './components/store-traffic-trend-widget/store-traffic-trend-widget';
import StoreComparisonWidget from './components/store-comparison-widget/store-comparison-widget';
import GroupTransactionInteractionWidget from './components/group-transaction-interaction-widget/group-transaction-interaction-widget';
import { downloadExcelFile } from 'src/utils/download.utils';

export function VisitorCountView() {
  const groups = useAppSelector(selectGroup);

  const [groupId, setGroupId] = useState('');
  const [trafficType, setTrafficType] = useState<ETrafficType>(
    ETrafficType.Footfall
  );

  const [selectDate, setSelectDate] = useState<ISelectDateValue>({
    timeFilterType: ETimeFilterType.Today,
    startDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
  });

  const dataOverviewRequest: IDataOverviewRequest = useMemo(
    () => ({
      group_id: groupId,
      time_filter_type: selectDate.timeFilterType,
      start_date: selectDate.startDate,
      end_date: selectDate.endDate,
    }),
    [groupId, selectDate]
  );

  const trafficChartRequest: ITrafficChartRequest = useMemo(
    () => ({
      group_id: groupId,
      type: trafficType,
      time_filter_type: selectDate.timeFilterType,
      start_date: selectDate.startDate,
      end_date: selectDate.endDate,
    }),
    [groupId, selectDate, trafficType]
  );

  const { data: dataOverview } = useDataOverview(dataOverviewRequest);
  const { data: trafficChart } = useTrafficChart(trafficChartRequest);
  const { data: summaryTable } = useSummaryTable(dataOverviewRequest);
  const { refetch: exportTrafficChart, isFetching: isExporting } =
    useExportTrafficChart(trafficChartRequest);

  const handleExportTrafficChart = async () => {
    try {
      const result = await exportTrafficChart();
      if (result.data) {
        downloadExcelFile(result.data, 'traffic', {
          startDate: selectDate.startDate,
          endDate: selectDate.endDate,
          timeFilterType: selectDate.timeFilterType,
        });
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <DashboardContent disablePadding maxWidth={false}>
      <Column
        padding={`${pxToRem(16)} ${pxToRem(16)} ${pxToRem(20)} ${pxToRem(16)}`}
        gap={pxToRem(20)}
      >
        <Row justifyContent='space-between'>
          <Typography variant='h3'>{FEATURE.VISITOR_COUNT.title}</Typography>
          <Row gap={pxToRem(8)}>
            <InputSelectDate
              value={selectDate}
              onChangeValue={(value) => setSelectDate(value)}
              placeholder='Select date range'
              width={pxToRem(240)}
            />
            <InputSelect
              value={groupId}
              list={groups}
              onChangeValue={setGroupId}
              placeholder='Choose store'
              showAllOption
              allOptionLabel='All Stores'
              startIcon={
                <SvgColor
                  sx={{ marginRight: pxToRem(4) }}
                  src={ASSET_CONSTANT.SVG.IconLinearHome3}
                  width={pxToRem(24)}
                  height={pxToRem(24)}
                  color='neutral.100'
                />
              }
            />
          </Row>
        </Row>
        <VisitorCountOverviewWidget
          data={dataOverview}
          timeFilterType={selectDate.timeFilterType}
        />
        <TrafficChartWidget
          title='Traffic chart'
          data={trafficChart}
          timeFilterType={selectDate.timeFilterType}
          trafficType={trafficType}
          onChangeTrafficType={(value) => setTrafficType(value as ETrafficType)}
          onExport={handleExportTrafficChart}
          isExporting={isExporting}
        />
        <SummaryTableWidget
          site='visitor-count'
          data={summaryTable?.data || []}
        />
        <StoreTrafficTrendWidget />
        <TopStoreWidget />
        <StoreComparisonWidget />
        <GroupTransactionInteractionWidget />
      </Column>
    </DashboardContent>
  );
}
