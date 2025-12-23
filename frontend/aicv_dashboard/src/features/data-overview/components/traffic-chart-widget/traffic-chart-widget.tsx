import React from 'react';
import InputSelect from 'src/components/input/input-select/input-select';
import { SELECT_TRAFFIC_DATA } from 'src/_mock/_data';
import type { ITrafficChartResponse } from 'src/models/data-overview';
import {
  ETimeFilterType,
  type ETrafficType,
} from 'src/models/common/models.enum';
import { getRangeDateCompare } from 'src/utils/label.utils';
import type { IZone } from 'src/models/zone';

import ColumnLineComparisonChart from './column-line-comparison-chart';
import { BaseChartWidget } from 'src/components/chart/base-chart-widget';
import { BaseChartTitle } from 'src/components/chart/base-chart-title';
import BaseButton from 'src/components/button/base-button/base-button';
import BaseIcon from 'src/components/svg/base-icon/base-icon';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';

interface TrafficChartWidgetProps {
  title: string;
  data?: ITrafficChartResponse;
  timeFilterType: ETimeFilterType;
  trafficType?: ETrafficType;
  onChangeTrafficType?: (value: string) => void;
  zoneId?: string;
  onChangeZoneId?: (value: string) => void;
  zoneList?: IZone[];
  onExport?: () => void;
  isExporting?: boolean;
}

const TrafficChartWidget: React.FC<TrafficChartWidgetProps> = ({
  title,
  data,
  timeFilterType,
  trafficType,
  onChangeTrafficType,
  zoneList = [],
  zoneId,
  onChangeZoneId,
  onExport,
  isExporting = false,
}) => {
  const labelCurrent = getRangeDateCompare({
    timeFilterType,
    type: 'current',
    currentStartDate: data?.current_start_date,
    currentEndDate: data?.current_end_date,
    compareStartDate: data?.compare_start_date,
    compareEndDate: data?.compare_end_date,
  });

  const labelCompare = getRangeDateCompare({
    timeFilterType,
    type: 'compare',
    currentStartDate: data?.current_start_date,
    currentEndDate: data?.current_end_date,
    compareStartDate: data?.compare_start_date,
    compareEndDate: data?.compare_end_date,
  });

  // Prepare legends
  const legends = [
    {
      type: 'bar' as const,
      color: 'purple.20',
      title: labelCurrent,
    },
    {
      type: 'line' as const,
      color: 'blue.60',
      title: labelCompare,
    },
  ];

  // Prepare header controls
  const headerControls = (
    <>
      {onChangeTrafficType && (
        <InputSelect
          value={trafficType}
          list={SELECT_TRAFFIC_DATA}
          onChangeValue={onChangeTrafficType}
        />
      )}
      {onChangeZoneId && (
        <InputSelect
          value={zoneId}
          list={
            zoneList?.map((item) => ({
              id: item.id,
              name: item.name,
            })) || []
          }
          onChangeValue={onChangeZoneId}
          placeholder='Choose zone'
          showAllOption
          allOptionLabel='All Zones'
        />
      )}
      {onExport && (
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
      )}
    </>
  );

  return (
    <BaseChartWidget
      title={title}
      tooltipText=''
      legends={legends}
      headerControls={headerControls}
      chartTitle={<BaseChartTitle title={`Traffic\nnumber`} />}
    >
      <ColumnLineComparisonChart
        categories={data?.data.map((item) => item.label) || []}
        series={[
          {
            name: labelCurrent,
            type: 'column',
            data: data?.data.map((item) => item.current_value) || [],
          },
          {
            name: labelCompare,
            type: 'line',
            data: data?.data.map((item) => item.compare_value) || [],
          },
        ]}
        maxTodayIndex={data?.max_index || 0}
        labelCurrent={labelCurrent}
        labelCompare={labelCompare}
        xAxistickAmount={12}
        tooltipCssClass='translate-y-120'
      />
    </BaseChartWidget>
  );
};

export default React.memo(TrafficChartWidget);
