import React, { useMemo, useState } from 'react';
import InputSelect from 'src/components/input/input-select/input-select';
import { SELECT_TREND_CHART } from 'src/_mock/_data';
import { ETrafficType, ETrendChartType } from 'src/models/common/models.enum';

import { BaseChartWidget } from 'src/components/chart/base-chart-widget';
import { BaseChartTitle } from 'src/components/chart/base-chart-title';
import ColumnLineComparisonChart, {
  type ColumnLineComparisonSeries,
} from 'src/features/data-overview/components/traffic-chart-widget/column-line-comparison-chart';
import type { IZoneTrafficTrendChartRequest } from 'src/models/analystics';
import type { IZone } from 'src/models/zone';
import {
  useExportZoneTrafficTrendChart,
  useZoneTrafficTrendChart,
} from 'src/features/analytic/hooks/use-analytics-service';
import { downloadExcelFile } from 'src/utils/download.utils';
import BaseButton from 'src/components/button/base-button/base-button';
import BaseIcon from 'src/components/svg/base-icon/base-icon';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';

type ZoneTrafficTrendWidgetProps = {
  zoneList?: IZone[];
};

const ZoneTrafficTrendWidget: React.FC<ZoneTrafficTrendWidgetProps> = ({
  zoneList,
}) => {
  const [zoneId, setZoneId] = useState('');
  const [trendChartType, setTrendChartType] = useState<ETrendChartType>(
    ETrendChartType.Weekly
  );

  const trafficTrendChartRequest: IZoneTrafficTrendChartRequest = useMemo(
    () => ({
      zone_id: zoneId,
      type: ETrafficType.TotalTraffic,
      time_filter_type: trendChartType,
    }),
    [zoneId, trendChartType]
  );

  const { data: trafficTrendChart } = useZoneTrafficTrendChart(
    trafficTrendChartRequest
  );

  const { refetch: exportZoneTrafficTrendChart, isFetching: isExporting } =
    useExportZoneTrafficTrendChart(trafficTrendChartRequest);

  const onExport = async () => {
    try {
      const result = await exportZoneTrafficTrendChart();
      if (result.data) {
        downloadExcelFile(result.data, 'zone_traffic_trend', {
          timeFilterType: trendChartType,
        });
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const headerControls = (
    <>
      <InputSelect
        value={trendChartType}
        list={SELECT_TREND_CHART}
        onChangeValue={(value) => setTrendChartType(value as ETrendChartType)}
      />
      <InputSelect
        value={zoneId}
        list={
          zoneList?.map((item) => ({
            id: item.id,
            name: item.name,
          })) || []
        }
        onChangeValue={(value) => setZoneId(value as string)}
        placeholder='Choose zone'
        showAllOption
        allOptionLabel='All Zones'
      />
      <BaseButton
        text='Export'
        size='medium'
        onClick={onExport}
        loading={isExporting}
        iconLeft={
          <BaseIcon
            size={20}
            src={ASSET_CONSTANT.SVG.IconLinearDownload}
            color='white'
          />
        }
      />
    </>
  );

  const categories =
    trafficTrendChart?.data.map((item) => item.short_label ?? '') || [];

  const tooltipCategories =
    trafficTrendChart?.data.map((item) => item.label ?? '') || [];

  const series: ColumnLineComparisonSeries[] = [
    {
      name: 'Footfall',
      type: 'column',
      data: trafficTrendChart?.data.map((item) => item.current_value) || [],
    },
    {
      name: 'Passby',
      type: 'line',
      data: trafficTrendChart?.data.map((item) => item.current_value) || [],
    },
  ];

  const strokeConfig = {
    width: [0, 1.5],
    curve: 'smooth' as const,
    dashArray: [0, 0],
  };

  return (
    <BaseChartWidget
      title={'Traffic trend'}
      height={367}
      tooltipText=''
      headerControls={headerControls}
      chartTitle={<BaseChartTitle title={'Visitor count'} />}
    >
      <ColumnLineComparisonChart
        categories={categories}
        series={series}
        labelCurrent='Visitor'
        stroke={strokeConfig}
        tooltipCategories={tooltipCategories}
        tooltipCssClass='translate-y-80'
      />
    </BaseChartWidget>
  );
};

export default React.memo(ZoneTrafficTrendWidget);
