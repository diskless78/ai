import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { StyledHorizontalBarChart } from './styles';
import { renderTooltipChart } from 'src/utils/tooltip.utils';

export interface HorizontalBarSeries {
  name: string;
  data: number[];
  percent: number[];
}

interface HorizontalBarChartProps {
  categories: string[];
  series: HorizontalBarSeries[];
  color: string;
  labelCompare: string;
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  categories,
  series,
  color,
  labelCompare,
}) => {
  const theme = useTheme();

  const getBarHeight = (count: number) => {
    if (count <= 2) return '35%';
    if (count === 3) return '35%';
    if (count === 4) return '45%';
    if (count === 5) return '55%';
    if (count === 6) return '60%';
    if (count === 7) return '65%';
    if (count === 8) return '68%';
    return '70%';
  };

  const customTooltip = React.useCallback(
    ({ dataPointIndex }: { dataPointIndex: number }) => {
      const currentLabel = categories[dataPointIndex];
      const currentValue = series[0].data[dataPointIndex];
      const currentPercent = series[0].percent[dataPointIndex];
      const currentColor = color;

      const data = [
        {
          label: currentLabel,
          color: currentColor,
          value: currentValue,
        },
      ];

      return renderTooltipChart({
        theme,
        comparePercent: currentPercent,
        items: data,
        labelCompare: labelCompare,
      });
    },
    [categories, series, color, labelCompare, theme]
  );

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
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
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: getBarHeight(categories.length),
        dataLabels: {
          position: 'right',
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toLocaleString(),
      style: {
        fontSize: '13px',
        fontWeight: 600,
        colors: ['#ffffff'],
      },
      textAnchor: 'end',
      dropShadow: {
        enabled: false,
      },
    },
    xaxis: {
      categories,
      labels: {
        style: {
          fontSize: theme.typography.b4Regular.fontSize?.toString(),
          fontWeight: theme.typography.b4Regular.fontWeight,
          colors: theme.palette.neutral[100],
        },
      },
      axisBorder: {
        show: true,
        color: theme.palette.neutral[60],
        height: 1,
      },
      axisTicks: {
        show: true,
        color: theme.palette.neutral[60],
      },
    },
    yaxis: {
      show: categories.length > 0,
      labels: {
        style: {
          fontSize: theme.typography.b4Regular.fontSize?.toString(),
          fontWeight: theme.typography.b4Regular.fontWeight,
          colors: theme.palette.neutral[100],
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    tooltip: {
      custom: customTooltip,
      y: {
        formatter: (val: number) => val.toLocaleString(),
      },
    },
    grid: {
      show: false,
    },
    colors: [color],
  };

  return (
    <StyledHorizontalBarChart>
      <Chart options={options} series={series} type='bar' height={358} />
    </StyledHorizontalBarChart>
  );
};

export default HorizontalBarChart;
