// import { useTheme } from '@mui/material';
// import { Chart, useChart, ChartOptions } from 'src/components/chart';
// import Column from 'src/components/common/column';
// import { useLanguage } from 'src/i18n/i18n';
// import { pxToRem } from 'src/theme/styles';
// // import { fNumber } from 'src/utils/format-number';

// type Props = {
//   chart: {
//     colors?: string[];
//     series: {
//       label: string;
//       value: number;
//     }[];
//     options?: ChartOptions;
//   };
//   size?: { xs?: string; sm?: string; md?: string; lg?: string; xl?: string };
//   stroke?: number;
// };

// export default function DonutChart({ chart, size, stroke = 0 }: Props) {
//   const lang = useLanguage();
//   const theme = useTheme();
//   const chartSeries = chart.series.map((item) => item.value);
//   const chartColors = chart.colors ?? [theme.palette.purple[500], theme.palette.purple[300]];
//   const sizeDefault = {
//     xs: pxToRem(200),
//     sm: pxToRem(200),
//     md: pxToRem(200),
//     lg: pxToRem(200),
//     xl: pxToRem(200),
//   };

//   const chartOptions = useChart({
//     chart: { sparkline: { enabled: true } },
//     colors: chartColors,
//     labels: chart.series.map((item) => item.label),
//     stroke: { width: stroke },
//     dataLabels: { enabled: false, dropShadow: { enabled: false } },
//     tooltip: {
//       enabled: false,
//       // theme: 'light',
//       // y: {
//       //   formatter: (value: number) => fNumber(value),
//       //   title: { formatter: (seriesName: string) => `${seriesName}` },
//       // },
//     },
//     plotOptions: {
//       pie: {
//         donut: {
//           labels: {
//             show: true,
//             value: {
//               show: true,
//               fontSize: '18px',
//               fontWeight: 500,
//               color: theme.palette.primary.darker,
//             },
//             total: {
//               show: true,
//               fontSize: '14px',
//               color: theme.palette.primary.darker,
//               label: lang('DashBoard.Total'),
//             },
//           },
//         },
//       },
//     },
//     ...chart.options,
//   });

//   return (
//     <Column>
//       <Chart
//         type="donut"
//         series={chartSeries}
//         options={chartOptions}
//         width={size || sizeDefault}
//         height={size || sizeDefault}
//         sx={{ mx: 'auto' }}
//       />
//     </Column>
//   );
// }
