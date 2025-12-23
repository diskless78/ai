import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material';
import { renderTooltipChart } from 'src/utils/tooltip.utils';
import { StyledTransactionInteractionWidget } from './styles';

export interface TransactionInteractionSeries {
  name: string;
  data: number[];
  percent: number[];
}

interface TransactionInteractionChartProps {
  categories: string[];
  series: TransactionInteractionSeries[];
  colors: string[];
}

const TransactionInteractionChart: React.FC<
  TransactionInteractionChartProps
> = ({ categories, series, colors }) => {
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
      width: [0, 0],
      curve: 'straight',
    },

    markers: {
      size: [0, 0],
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
        borderRadius: 4,
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
      intersect: false,
      custom: ({ dataPointIndex }) => {
        return renderTooltipChart({
          title: categories[dataPointIndex],
          theme,
          items: series.map((item, index) => ({
            label: item.name,
            color: colors[index],
            value: item.data[dataPointIndex],
            percent: item.percent[dataPointIndex],
          })),
        });
      },
    },
  };

  return (
    <StyledTransactionInteractionWidget
      style={{ height: height, minHeight: height }}
    >
      <Chart options={options} series={series} type='bar' height={height} />
    </StyledTransactionInteractionWidget>
  );
};

export default TransactionInteractionChart;
