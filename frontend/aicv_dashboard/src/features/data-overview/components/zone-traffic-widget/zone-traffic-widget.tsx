import React from 'react';
import { useTheme } from '@mui/material';
import { BaseCard } from 'src/components/card/base-card/base-card';
import { pxToRem } from 'src/theme/styles';
import Column from 'src/components/common/column';
import ZoneTrafficChart from './zone-traffic-chart';
import type { IZoneTrafficChartItem } from 'src/models/data-overview';
import { BaseChartTitle } from 'src/components/chart/base-chart-title';
import { BaseChartWidget } from 'src/components/chart/base-chart-widget';
import InputSelect from 'src/components/input/input-select/input-select';
import { SELECT_GATE_SHOP_DATA } from 'src/_mock/_data';
import { EGateShopType } from 'src/models/common/models.enum';

interface IZoneTrafficWidgetProps {
  data: IZoneTrafficChartItem[];
  gateShopType: EGateShopType;
  onChangeGateShopType: (value: EGateShopType) => void;
}

const ZoneTrafficWidget: React.FC<IZoneTrafficWidgetProps> = ({
  data,
  gateShopType,
  onChangeGateShopType,
}) => {
  const theme = useTheme();
  const categories = data.map((item) => item.zone_name);

  const series = [
    {
      name: gateShopType === EGateShopType.Gate ? 'Traffic' : 'Dwell time',
      type: 'column',
      data: data.map((item) => item.data.current_value),
      percent: data.map((item) => item.data.compare_percent),
    },
  ];

  const colors = [theme.palette.green[50]];

  // Prepare legends
  // const legends = [
  //   {
  //     type: 'bar' as const,
  //     color: 'green.50',
  //     title: 'Traffic',
  //   },
  // ];

  return (
    <BaseCard title='Dwell time & zone traffic chart' size='medium'>
      <Column
        p={`${pxToRem(15)} ${pxToRem(14)} ${pxToRem(12)} ${pxToRem(14)}`}
        position='relative'
      >
        <BaseChartWidget
          title=''
          height={312}
          chartTitle={
            <BaseChartTitle
              title={
                gateShopType === EGateShopType.Gate
                  ? `Traffic\nnumber`
                  : `Time\n(seconds)`
              }
            />
          }
          headerPadding='0'
        >
          <ZoneTrafficChart
            categories={categories}
            series={series}
            colors={colors}
            gateShopType={gateShopType}
          />
        </BaseChartWidget>

        <InputSelect
          sx={{
            position: 'absolute',
            top: pxToRem(20),
            right: pxToRem(20),
            zIndex: 1,
          }}
          value={gateShopType}
          list={SELECT_GATE_SHOP_DATA}
          placeholder='Select type'
          onChangeValue={(value) =>
            onChangeGateShopType(value as EGateShopType)
          }
        />
      </Column>
    </BaseCard>
  );
};

export default React.memo(ZoneTrafficWidget);
