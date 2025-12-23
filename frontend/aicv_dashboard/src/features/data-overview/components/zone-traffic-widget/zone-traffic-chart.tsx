import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material';
import { renderTooltipChart } from 'src/utils/tooltip.utils';
import { StyledZoneTrafficChart } from './styles';
import { EGateShopType } from 'src/models/common/models.enum';
import { formatValueByType } from 'src/utils/label.utils';

export interface ZoneTrafficSeries {
  name: string;
  data: number[];
  percent: number[];
}

interface ZoneTrafficChartProps {
  categories: string[];
  series: ZoneTrafficSeries[];
  colors: string[];
  gateShopType: EGateShopType;
}

const ZoneTrafficChart: React.FC<ZoneTrafficChartProps> = ({
  categories,
  series,
  colors,
  gateShopType,
}) => {
  const theme = useTheme();
  const height = 216;

  const options: ApexCharts.ApexOptions = {
    chart: {
      height: height,
      toolbar: { show: false },
      zoom: { enabled: false },
    },

    colors: colors,

    stroke: {
      width: [0],
      curve: 'straight',
    },

    markers: {
      size: [0],
      strokeWidth: 1.5,
      strokeColors: theme.palette.blue[60],
      colors: ['#fff'],
      hover: { size: 4 },
    },

    states: {
      hover: {
        filter: {
          type: 'none',
        },
      },
      active: {
        filter: {
          type: 'none',
        },
      },
    },

    legend: {
      show: false,
    },

    plotOptions: {
      bar: {
        columnWidth: '65%',
        borderRadius: 8,
      },
    },

    dataLabels: { enabled: false },

    xaxis: {
      categories,
      tooltip: {
        enabled: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontSize: theme.typography.b4Regular.fontSize?.toString(),
          fontWeight: theme.typography.b4Regular.fontWeight,
          colors: theme.palette.neutral[100],
        },
        trim: true,
        rotate: 0,
        formatter: (value: string) => {
          const maxLength = 8; // Adjusted for 52px width
          if (value && value.length > maxLength) {
            return value.substring(0, maxLength) + '...';
          }
          return value || '';
        },
      },
    },

    yaxis: [
      {
        labels: {
          style: {
            fontSize: theme.typography.b4Regular.fontSize?.toString(),
            fontWeight: theme.typography.b4Regular.fontWeight,
            colors: theme.palette.neutral[100],
          },
          formatter: (value: number) =>
            formatValueByType(
              value,
              gateShopType === EGateShopType.Shop ? 'seconds' : 'number'
            ),
        },
      },
    ],

    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 5,
      padding: {
        top: -5,
        left: 23,
        right: 10,
      },
    },

    tooltip: {
      shared: true,
      custom: ({ dataPointIndex }) => {
        return renderTooltipChart({
          title: categories[dataPointIndex],
          theme,
          items: series.map((item, index) => ({
            label: item.name,
            color: colors[index],
            value: item.data[dataPointIndex],
            format: gateShopType === EGateShopType.Shop ? 'seconds' : 'number',
            percent: item.percent[dataPointIndex],
          })),
        });
      },
    },
  };

  return (
    <StyledZoneTrafficChart style={{ height: height, minHeight: height }}>
      <Chart options={options} series={series} type='line' height={height} />
    </StyledZoneTrafficChart>
  );
};

export default ZoneTrafficChart;
