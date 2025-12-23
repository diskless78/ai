import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material';
import { renderTooltipChart } from 'src/utils/tooltip.utils';
import { StyledColumnLineComparisonChart } from './styles';

export interface ColumnLineComparisonSeries {
  name: string;
  type: 'column' | 'line';
  data: number[];
}

interface ColumnLineComparisonChartProps {
  categories: string[];
  series: ColumnLineComparisonSeries[];
  maxTodayIndex?: number;
  labelCurrent: string;
  labelCompare?: string;
  stroke?: ApexStroke;
  tooltipCategories?: string[];
  xAxistickAmount?: number;
  tooltipCssClass?: string;
}

const ColumnLineComparisonChart: React.FC<ColumnLineComparisonChartProps> = ({
  categories,
  series,
  maxTodayIndex = -1,
  labelCurrent,
  labelCompare,
  stroke,
  tooltipCategories,
  xAxistickAmount,
  tooltipCssClass,
}) => {
  const theme = useTheme();
  const height = 260;

  const injectGradient = (chartContext: any) => {
    const svg = chartContext.el.querySelector('svg');
    if (!svg) return;

    let defs = svg.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svg.insertBefore(defs, svg.firstChild);
    }

    defs.innerHTML = `
      <linearGradient id="solidBase" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#CAB0FF" stop-opacity="1" />
        <stop offset="100%" stop-color="#CAB0FF" stop-opacity="1" />
      </linearGradient>

      <linearGradient id="softFade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(224, 209, 255, 0.32)" stop-opacity="1" />
        <stop offset="100%" stop-color="rgba(159, 118, 236, 0.32)" stop-opacity="1" />
      </linearGradient>

      <pattern id="footfallGradient" patternUnits="objectBoundingBox" width="1" height="1">
        <rect width="100%" height="100%" fill="url(#solidBase)" />
        <rect width="100%" height="100%" fill="url(#softFade)" />
      </pattern>
    `;
  };

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'line',
      height,
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true, // ← Đây là key để có animation khi data update
          speed: 350,
        },
      },
      events: {
        mounted: injectGradient,
        updated: injectGradient,
      },
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

    colors: [
      function ({
        seriesIndex,
        dataPointIndex,
      }: {
        seriesIndex: number;
        dataPointIndex: number;
      }) {
        if (seriesIndex === 0) {
          return dataPointIndex === maxTodayIndex
            ? '#FF6B00'
            : 'url(#footfallGradient)';
        }
        return theme.palette.blue[60];
      },
      theme.palette.blue[60],
    ],

    stroke: stroke || {
      width: [0, 1.5],
      curve: 'straight',
      dashArray: [0, 4],
    },

    markers: {
      size: [0, 4],
      strokeWidth: 1.5,
      strokeColors: theme.palette.blue[60],
      colors: ['#fff'],
      hover: { size: 4 },
    },

    plotOptions: {
      bar: {
        columnWidth: '75%',
        borderRadius: 8,
      },
    },

    dataLabels: { enabled: false },

    legend: { show: false },

    xaxis: {
      categories,
      tickAmount: xAxistickAmount,
      tooltip: {
        enabled: false,
      },
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

    yaxis: {
      labels: {
        style: {
          fontSize: theme.typography.b4Regular.fontSize?.toString(),
          fontWeight: theme.typography.b4Regular.fontWeight,
          colors: theme.palette.neutral[100],
        },
      },
    },

    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 4,
      padding: { top: 0, left: 10, right: 10 },
    },

    tooltip: {
      shared: true,
      cssClass: tooltipCssClass,
      custom: ({ dataPointIndex }) => {
        const today = series[0].data[dataPointIndex];
        const yesterday = series[1].data[dataPointIndex];
        const percent =
          yesterday === 0
            ? 0
            : Math.round(((today - yesterday) / yesterday) * 100);

        const lastLabel = labelCompare
          ? `compare to ${labelCompare.toLowerCase()}`
          : '';

        const compareObject = labelCompare
          ? {
              comparePercent: percent,
              labelCompare: lastLabel,
            }
          : {};

        const items: any = [
          {
            label: labelCurrent,
            color:
              dataPointIndex === maxTodayIndex
                ? theme.palette.orange[50]
                : theme.palette.purple[50],
            value: today,
            suffix: dataPointIndex === maxTodayIndex ? ' (Peak)' : '',
          },
        ];

        if (labelCompare && labelCompare.trim() !== '') {
          items.push({
            label: labelCompare,
            color: theme.palette.blue[60],
            value: yesterday,
          });
        }

        const title =
          (tooltipCategories?.length ?? 0) > 0
            ? tooltipCategories![dataPointIndex]
            : categories[dataPointIndex];

        return renderTooltipChart({
          title: title,
          theme,
          ...compareObject,
          items: items,
        });
      },
    },
  };

  return (
    <StyledColumnLineComparisonChart style={{ height }}>
      <Chart options={options} series={series} type='line' height={height} />
    </StyledColumnLineComparisonChart>
  );
};

export default ColumnLineComparisonChart;
