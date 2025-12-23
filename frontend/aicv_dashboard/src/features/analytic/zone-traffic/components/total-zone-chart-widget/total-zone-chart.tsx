import { useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme, Box, Stack } from '@mui/material';
import BaseLegend from 'src/components/chart/base-legend';
import Column from 'src/components/common/column';
import { renderTooltipChart } from 'src/utils/tooltip.utils';

export interface ZoneSeries {
  id: string;
  name: string;
  data: number[];
  percent: number[];
}

interface SeriesConfig extends ZoneSeries {
  color: string;
  visible: boolean;
}

interface TotalZoneChartProps {
  categories: string[];
  series: ZoneSeries[];
  colors: string[];
}

const CHART_ID = 'total-zone-bar-chart';
const CHART_HEIGHT = 380;
const COLUMN_WIDTH = '55%';
const TICK_AMOUNT = 12;

/**
 * Create series configuration with colors and visibility state
 */
const createSeriesConfig = (
  series: ZoneSeries[],
  colors: string[]
): SeriesConfig[] => {
  return series.map((s, i) => ({
    ...s,
    color: colors[i] || colors[colors.length - 1],
    visible: true,
  }));
};

const TotalZoneChart: React.FC<TotalZoneChartProps> = ({
  categories,
  series: initialSeries,
  colors,
}) => {
  const theme = useTheme();
  const [seriesConfig, setSeriesConfig] = useState<SeriesConfig[]>([]);

  // Sync series config when props change
  useEffect(() => {
    setSeriesConfig(createSeriesConfig(initialSeries, colors));
  }, [initialSeries, colors]);

  // Filter visible series for chart rendering
  const visibleSeries = useMemo(
    () =>
      seriesConfig
        .filter((s) => s.visible)
        .map(({ id, name, data, percent }) => ({ id, name, data, percent })),
    [seriesConfig]
  );

  const visibleColors = useMemo(
    () => seriesConfig.filter((s) => s.visible).map((s) => s.color),
    [seriesConfig]
  );

  const toggleSeries = (id: string) => {
    setSeriesConfig((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    );
  };

  const chartOptions: ApexCharts.ApexOptions = useMemo(
    () => ({
      chart: {
        id: CHART_ID,
        type: 'bar',
        stacked: true,
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: {
          enabled: true,
          animateGradually: { enabled: true, delay: 300 },
          dynamicAnimation: { enabled: false, speed: 800 },
        },
      },
      states: {
        hover: { filter: { type: 'none' } },
        active: { filter: { type: 'none' } },
      },
      colors: visibleColors,
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: COLUMN_WIDTH,
        },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories,
        tickAmount: TICK_AMOUNT,
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
      tooltip: {
        shared: true,
        intersect: false,
        custom: ({ dataPointIndex }) => {
          return renderTooltipChart({
            title: categories[dataPointIndex],
            theme,
            items: visibleSeries.map((item, index) => ({
              label: item.name,
              color: colors[index],
              value: item.data[dataPointIndex],
              percent: item.percent[dataPointIndex],
            })),
            typePercent: 'blue',
          });
        },
      },
      legend: { show: false },
      grid: { borderColor: theme.palette.divider, strokeDashArray: 4 },
    }),
    [visibleColors, categories, theme, visibleSeries, colors]
  );

  return (
    <Column>
      <Stack direction='row' spacing={2} flexWrap='wrap' mb={3}>
        {seriesConfig.map((item) => (
          <Box
            key={item.id}
            sx={{
              cursor: 'pointer',
              opacity: item.visible ? 1 : 0.4,
              transition: 'opacity 0.3s',
              '&:hover': { opacity: 0.8 },
            }}
            onClick={() => toggleSeries(item.id)}
          >
            <BaseLegend type='bar' color={item.color} title={item.name} />
          </Box>
        ))}
      </Stack>

      <Chart
        options={chartOptions}
        series={visibleSeries}
        type='bar'
        height={CHART_HEIGHT}
      />
    </Column>
  );
};

export default TotalZoneChart;
