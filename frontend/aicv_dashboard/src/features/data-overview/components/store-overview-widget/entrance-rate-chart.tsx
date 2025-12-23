import React from 'react';
import Chart from 'react-apexcharts';
import { Box, Typography, useTheme } from '@mui/material';
import PercentageChip from '../percentage-chip/percentage-chip';
import SizedBox from 'src/components/common/sized-box';
import { renderTooltipChart } from 'src/utils/tooltip.utils';

interface EntranceRateChartProps {
  series: number[];
  seriesPercent: number[];
  labels: string[];
  centerLabel?: string;
  centerValue: number | string;
  percent?: number;
  customColors?: string[];
  labelCompare: string;
}

const EntranceRateChart: React.FC<EntranceRateChartProps> = ({
  series,
  seriesPercent,
  labels,
  centerLabel = 'Entrance rate',
  centerValue,
  percent = 0,
  customColors,
  labelCompare,
}) => {
  const theme = useTheme();

  const chartWidth = 194;
  const donutBorder = 10;
  const strokeWidth = 6;

  const donutPercent =
    ((chartWidth - (donutBorder * 2 + strokeWidth * 2)) / chartWidth) * 100;

  const defaultColors = [theme.palette.purple[50], theme.palette.purple[20]];

  const chartColors = customColors || defaultColors;

  const customTooltip = React.useCallback(
    ({ seriesIndex }: { seriesIndex: number }) => {
      const currentLabel = labels[seriesIndex];
      const currentValue = series[seriesIndex];
      const currentPercent = seriesPercent[seriesIndex];
      const currentColor = chartColors[seriesIndex];

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
        labelCompare,
      });
    },
    [chartColors, labels, series, seriesPercent, theme, labelCompare]
  );

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'donut',
      sparkline: { enabled: true },
      animations: {
        enabled: true,
        animateGradually: { enabled: true, delay: 300 },
        dynamicAnimation: { enabled: true, speed: 1000 },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: `${donutPercent}%`,
          background: 'transparent',
          labels: {
            show: false,
          },
        },
        expandOnClick: false,
        customScale: 1,
      },
    },
    stroke: {
      width: strokeWidth,
      lineCap: 'round',
      colors: [theme.palette.neutral[0]],
    },
    fill: {
      colors: chartColors,
    },
    colors: chartColors,
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } },
    },
    labels: labels,
    legend: { show: false },
    dataLabels: { enabled: false },
    tooltip: {
      shared: true,
      intersect: false,
      custom: customTooltip,
    },
  };

  return (
    <Box
      display='flex'
      flexDirection='row'
      alignItems='center'
      justifyContent='center'
      position='relative'
      width={chartWidth}
      height={chartWidth}
    >
      <Chart
        options={chartOptions}
        series={series}
        type='donut'
        width={chartWidth}
        height={chartWidth}
      />

      <Box
        position='absolute'
        top='calc(50% + 6px)'
        left='50%'
        sx={{ transform: 'translate(-50%, -50%)', textAlign: 'center' }}
      >
        <Typography variant='b4Medium' color='neutral.70'>
          {centerLabel}
        </Typography>

        <SizedBox height={4} />

        <Typography variant='h1' color='blue.90'>
          {centerValue}%
        </Typography>

        <SizedBox height={4} />

        <PercentageChip value={percent} />
      </Box>
    </Box>
  );
};

export default EntranceRateChart;
