import Column from 'src/components/common/column';
import { pxToRem } from 'src/theme/styles';

import { DashboardContent } from 'src/layouts/dashboard/main';
import Row from 'src/components/common/row';
import { Grid, Typography } from '@mui/material';
import InputSelect from 'src/components/input/input-select/input-select';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { SvgColor } from 'src/components/svg/svg-color';
import SizedBox from 'src/components/common/sized-box';
import AlertCenterWidget from './components/alert-center-widget/alert-center-widget';
import StoreOverviewWidget from './components/store-overview-widget/store-overview-widget';
import RouteMapWidget from './components/route-map-widget/route-map-widget';
import HeatmapWidget from './components/heatmap-widget/heatmap-widget';
import TransactionInteractionWidget from './components/store-transaction-interaction/transaction-interaction-widget';
import { useAppSelector } from 'src/store';
import { useState, useMemo } from 'react';
import { selectGroup } from 'src/store/selectors/system.selectors';
import type {
  IDataOverviewRequest,
  ITrafficChartRequest,
  IZoneTrafficChartRequest,
} from 'src/models/data-overview';
import {
  EGateShopType,
  ETimeFilterType,
  ETrafficType,
} from 'src/models/common/models.enum';
import {
  useDataOverview,
  useTrafficChart,
  useZoneTrafficChart,
} from './hooks/use-data-overview-service';
import InputSelectDate from 'src/components/input/input-select-date/input-select-date';
import dayjs from 'dayjs';
import type { ISelectDateValue } from 'src/components/input/input-select-date/types';
import TrafficChartWidget from './components/traffic-chart-widget/traffic-chart-widget';
import ZoneTrafficWidget from './components/zone-traffic-widget/zone-traffic-widget';
import { FeatureFlag } from 'src/constants/feature-flags.constant';
import { useFeatureFlag } from 'src/hooks/use-feature-flag';
import type { ICameraListRequest } from 'src/models/camera';
import { useCameraList } from 'src/hooks/queries/use-common-service';

export function DataOverviewView() {
  const groups = useAppSelector(selectGroup);
  const { hasAccess } = useFeatureFlag();

  const [groupId, setGroupId] = useState('');
  const [trafficType, setTrafficType] = useState<ETrafficType>(
    ETrafficType.Footfall
  );
  const [gateShopType, setGateShopType] = useState<EGateShopType>(
    EGateShopType.Gate
  );

  const [selectDate, setSelectDate] = useState<ISelectDateValue>({
    timeFilterType: ETimeFilterType.Today,
    startDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
  });

  const cameraRequest: ICameraListRequest = {
    group_ids: groupId ? [groupId] : groups.map((group) => group.id),
    modules: 'rm',
  };
  const { data: cameraListData } = useCameraList(cameraRequest);

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

  const zoneTrafficChartRequest: IZoneTrafficChartRequest = useMemo(
    () => ({
      group_id: groupId,
      type: gateShopType,
      time_filter_type: selectDate.timeFilterType,
      start_date: selectDate.startDate,
      end_date: selectDate.endDate,
    }),
    [groupId, selectDate, gateShopType]
  );

  const { data: dataOverview } = useDataOverview(dataOverviewRequest);
  const { data: trafficChartData } = useTrafficChart(trafficChartRequest);
  const { data: zoneTrafficChartData } = useZoneTrafficChart(
    zoneTrafficChartRequest
  );

  return (
    <DashboardContent disablePadding maxWidth={false}>
      <Column
        padding={`${pxToRem(16)} ${pxToRem(16)} ${pxToRem(20)} ${pxToRem(16)}`}
      >
        <Row justifyContent='space-between'>
          <Typography variant='h3'>Overview activities</Typography>
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
        <SizedBox height={20} />
        <Grid container rowSpacing={pxToRem(20)} columnSpacing={pxToRem(12)}>
          <Grid size={{ xs: 12, md: 12, lg: 12 }}>
            <StoreOverviewWidget
              data={dataOverview}
              timeFilterType={selectDate.timeFilterType}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 12, lg: 12 }}>
            <TrafficChartWidget
              title='Traffic chart'
              data={trafficChartData}
              timeFilterType={selectDate.timeFilterType}
              trafficType={trafficType}
              onChangeTrafficType={(value) =>
                setTrafficType(value as ETrafficType)
              }
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ZoneTrafficWidget
              data={zoneTrafficChartData?.data || []}
              gateShopType={gateShopType}
              onChangeGateShopType={setGateShopType}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <AlertCenterWidget />
          </Grid>
          {hasAccess(FeatureFlag.TRANSACTION_AND_INTERACTION) && (
            <Grid size={{ xs: 12, md: 12, lg: 12 }}>
              <TransactionInteractionWidget />
            </Grid>
          )}

          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <RouteMapWidget
              cameraList={cameraListData?.data || []}
              selectDate={selectDate}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <HeatmapWidget />
          </Grid>
        </Grid>
      </Column>
    </DashboardContent>
  );
}
