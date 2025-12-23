// import type { ChartOptions } from 'src/components/chart';
// import Card from '@mui/material/Card';
// import { Chart, useChart } from 'src/components/chart';
// import { useTheme } from '@mui/material';

// // ----------------------------------------------------------------------

// type Props = {
//   chart: {
//     colors?: string[];
//     categories?: string[];
//     series: {
//       name: string;
//       data: number[];
//     }[];
//     options?: ChartOptions;
//   };
//   height: string | number;
//   tooltipPosition?: 'followCursor' | 'centerAboveBar';
//   extraInfoData?: string[];
//   extraInfoLabel?: string;
// };

// export default function BarChart({
//   chart,
//   height,
//   tooltipPosition,
//   extraInfoData,
//   extraInfoLabel,
// }: Props) {
//   const theme = useTheme();

//   const chartOptions = useChart({
//     colors: chart.colors || [
//       theme.palette.purple[600],
//       theme.palette.purple[300],
//     ],
//     stroke: {
//       width: 2,
//       colors: ['transparent'],
//     },
//     xaxis: {
//       categories: chart.categories || [],
//     },
//     tooltip: {
//       shared: true,
//       intersect: false,
//       marker: {
//         show: true,
//       },
//       followCursor: tooltipPosition === 'followCursor',
//       theme: 'light',
//       custom: ({ series, dataPointIndex, w }) => {
//         const category = chart.categories?.[dataPointIndex] || '';
//         let seriesContent = '';
//         series.forEach((seriesData: any, index: any) => {
//           const value = seriesData[dataPointIndex];
//           const seriesName = chart.series[index].name;
//           const markerColor = chart.colors?.[index] || w.config.colors[index];
//           seriesContent += `
//             <div style="display: flex; align-items: center; margin-top: ${theme.spacing(0.5)};">
//               <span style="display: inline-block; width: 10px; height: 10px; background-color: ${markerColor}; border-radius: 50%; margin-right: 8px;"></span>
//               <div style=" font-weight: ${theme.typography.fontWeightSemiBold}">${seriesName}</div>: ${value}
//             </div>
//           `;
//         });

//         const demodataContent =
//           extraInfoData && extraInfoData[dataPointIndex]
//             ? `
//             <div style="display: flex; align-items: center; margin-top: ${theme.spacing(0.5)};">
//               <div style="font-weight: ${theme.typography.fontWeightSemiBold}">${extraInfoLabel}</div>: ${extraInfoData[dataPointIndex]}
//             </div>
//         `
//             : '';

//         return `
//           <div style="
//             color: ${theme.palette.text.primary};
//             padding: ${theme.spacing(1.5)};
//             font-size: ${theme.typography.body2.fontSize};
//           ">
//             <div style="font-weight: ${theme.typography.fontWeightSemiBold}; margin-bottom: ${theme.spacing(1)};">
//               ${category}
//             </div>
//             <hr style="border: none; border-top: 1px solid ${theme.palette.divider}; margin: ${theme.spacing(1, 0)};" />
//             ${seriesContent}
//             ${demodataContent}
//           </div>
//         `;
//       },
//     },
//     yaxis: {},
//     fill: {
//       type: 'solid',
//     },
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         columnWidth: '50%',
//         borderRadius: 4,
//       },
//     },
//     ...chart.options,
//   });

//   return (
//     <Card sx={{ width: '100%', bgcolor: 'transparent', boxShadow: 'none' }}>
//       <Chart
//         series={chart.series}
//         options={chartOptions}
//         type='bar'
//         height={height}
//         width={1}
//       />
//     </Card>
//   );
// }
