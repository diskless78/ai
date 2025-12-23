import React, { useMemo, useState } from 'react';
import InputSelect from 'src/components/input/input-select/input-select';
import { SELECT_TRAFFIC_DATA, SELECT_TREND_CHART } from 'src/_mock/_data';
import { ETrafficType, ETrendChartType } from 'src/models/common/models.enum';

import { BaseChartWidget } from 'src/components/chart/base-chart-widget';
import { BaseChartTitle } from 'src/components/chart/base-chart-title';
import ColumnLineComparisonChart, {
  type ColumnLineComparisonSeries,
} from 'src/features/data-overview/components/traffic-chart-widget/column-line-comparison-chart';
import {
  useExportStoreTrafficTrendChart,
  useStoreTrafficTrendChart,
} from '../../../hooks/use-analytics-service';
import type { IStoreTrafficTrendChartRequest } from 'src/models/analystics';
import { useAppSelector } from 'src/store';
import { selectGroup } from 'src/store/selectors/system.selectors';
import { SvgColor } from 'src/components/svg/svg-color';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { pxToRem } from 'src/theme/styles';
import { downloadExcelFile } from 'src/utils/download.utils';
import BaseButton from 'src/components/button/base-button/base-button';
import BaseIcon from 'src/components/svg/base-icon/base-icon';

const StoreTrafficTrendWidget: React.FC = () => {
  const groups = useAppSelector(selectGroup);

  const [groupId, setGroupId] = useState('');
  const [trafficType, setTrafficType] = useState<ETrafficType>(
    ETrafficType.Footfall
  );
  const [trendChartType, setTrendChartType] = useState<ETrendChartType>(
    ETrendChartType.Weekly
  );

  const trafficTrendChartRequest: IStoreTrafficTrendChartRequest = useMemo(
    () => ({
      group_id: groupId,
      type: trafficType,
      time_filter_type: trendChartType,
    }),
    [groupId, trafficType, trendChartType]
  );

  const { data: trafficTrendChart } = useStoreTrafficTrendChart(
    trafficTrendChartRequest
  );

  const { refetch: exportStoreTrafficTrendChart, isFetching: isExporting } =
    useExportStoreTrafficTrendChart(trafficTrendChartRequest);

  const onExport = async () => {
    try {
      const result = await exportStoreTrafficTrendChart();
      if (result.data) {
        downloadExcelFile(result.data, 'store_traffic_trend', {
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
        value={trafficType}
        list={SELECT_TRAFFIC_DATA}
        onChangeValue={(value) => setTrafficType(value as ETrafficType)}
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

export default React.memo(StoreTrafficTrendWidget);
