import { Typography } from '@mui/material';
import Column from 'src/components/common/column';
import Row from 'src/components/common/row';
import InputSelect from 'src/components/input/input-select/input-select';
import { SvgColor } from 'src/components/svg/svg-color';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { FEATURE } from 'src/constants/feature-constant';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { pxToRem } from 'src/theme/styles';
import SizedBox from 'src/components/common/sized-box';
import SummaryTableWidget from '../visitor-count/components/summary-table-widget/summary-table-widget';
import TotalZoneChartWidget from './components/total-zone-chart-widget/total-zone-chart-widget';
import ZoneTrafficOverviewWidget from './components/zone-traffic-overview-widget/zone-traffic-overview-widget';
import { useState } from 'react';
import { useAppSelector } from 'src/store';
import { selectGroup } from 'src/store/selectors/system.selectors';
import type {
  IZoneAndTrafficChartRequest,
  IZoneTrafficOverviewRequest,
} from 'src/models/analystics';
import {
  useExportZoneTrafficChart,
  useSummaryTable,
  useZoneAndTrafficChart,
  useZoneTrafficOverview,
} from '../hooks/use-analytics-service';
import { useZoneList } from 'src/hooks/queries/use-common-service';
import type { IZoneListRequest } from 'src/models/zone';
import dayjs from 'dayjs';
import type { ISelectDateValue } from 'src/components/input/input-select-date/types';
import { ETimeFilterType } from 'src/models/common/models.enum';
import InputSelectDate from 'src/components/input/input-select-date/input-select-date';
import TrafficChartWidget from 'src/features/data-overview/components/traffic-chart-widget/traffic-chart-widget';
import ZoneComparisonWidget from './components/zone-comparison-widget/zone-comparison-widget';
import ZoneTrafficTrendWidget from './components/zone-traffic-trend-widget/zone-traffic-trend-widget';
import { downloadExcelFile } from 'src/utils/download.utils';

export function ZoneTrafficView() {
  const groupList = useAppSelector(selectGroup);

  const [groupId, setGroupId] = useState('');
  const [zoneId, setZoneId] = useState('');

  const [selectDate, setSelectDate] = useState<ISelectDateValue>({
    timeFilterType: ETimeFilterType.Today,
    startDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
  });

  const zoneTrafficOverviewRequest: IZoneTrafficOverviewRequest = {
    group_id: groupId,
    time_filter_type: selectDate.timeFilterType,
    start_date: selectDate.startDate,
    end_date: selectDate.endDate,
  };
  const zoneAndTrafficChartRequest: IZoneAndTrafficChartRequest = {
    group_id: groupId,
    time_filter_type: selectDate.timeFilterType,
    zone_id: zoneId,
    start_date: selectDate.startDate,
    end_date: selectDate.endDate,
  };
  const zoneListRequest: IZoneListRequest = {
    group_ids: groupId ? [groupId] : groupList.map((item) => item.id),
    type: ['gate', 'shop'],
  };

  const { data: zoneTrafficOverview } = useZoneTrafficOverview(
    zoneTrafficOverviewRequest
  );
  const { data: zoneAndTrafficChart } = useZoneAndTrafficChart(
    zoneAndTrafficChartRequest
  );
  const { data: zoneList } = useZoneList(zoneListRequest);
  const { data: summaryTable } = useSummaryTable(zoneTrafficOverviewRequest);
  const { refetch: exportTrafficChart, isFetching: isExporting } =
    useExportZoneTrafficChart(zoneAndTrafficChartRequest);

  const handleExportTrafficChart = async () => {
    try {
      const result = await exportTrafficChart();
      if (result.data) {
        downloadExcelFile(result.data, 'zone_traffic', {
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
      >
        <Row justifyContent='space-between'>
          <Typography variant='h3'>{FEATURE.ZONE_TRAFFIC.title}</Typography>
          <Row gap={pxToRem(8)}>
            <InputSelectDate
              value={selectDate}
              onChangeValue={(value) => setSelectDate(value)}
              placeholder='Select date range'
              width={pxToRem(240)}
            />
            <InputSelect
              value={groupId}
              list={groupList}
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
              onChangeValue={setGroupId}
            />
          </Row>
        </Row>
        <SizedBox height={20} />
        <ZoneTrafficOverviewWidget data={zoneTrafficOverview?.data} />
        <SizedBox height={20} />
        <TrafficChartWidget
          title='Traffic chart'
          data={zoneAndTrafficChart}
          timeFilterType={selectDate.timeFilterType}
          zoneList={zoneList?.data || []}
          zoneId={zoneId}
          onChangeZoneId={setZoneId}
          onExport={handleExportTrafficChart}
          isExporting={isExporting}
        />
        <SizedBox height={20} />
        <SummaryTableWidget
          site='zone-traffic'
          data={summaryTable?.data || []}
        />
        <SizedBox height={20} />
        <ZoneTrafficTrendWidget zoneList={zoneList?.data || []} />
        <SizedBox height={20} />
        <TotalZoneChartWidget />
        <SizedBox height={20} />
        <ZoneComparisonWidget />
      </Column>
    </DashboardContent>
  );
}
