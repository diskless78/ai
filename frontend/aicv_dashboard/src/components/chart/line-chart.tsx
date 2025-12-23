// import type { ChartOptions } from 'src/components/chart';
// import Card from '@mui/material/Card';
// import { Chart, useChart } from 'src/components/chart';
// import { useTheme } from '@mui/material';
// import { pxToRem } from 'src/theme/styles';
// import { ICustomTooltip } from 'src/models/kpi';
// import { useLanguage } from 'src/i18n/i18n';

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
//   curve?: any;
//   compareData?: number[];
//   compareLabel?: string;
//   tooltipKpi?: ICustomTooltip;
// };

// export default function LineChart({
//   chart,
//   height,
//   curve,
//   compareData,
//   compareLabel,
//   tooltipKpi,
// }: Props) {
//   const theme = useTheme();
//   const lang = useLanguage()
//   const chartOptions = useChart({
//     colors: chart.colors ?? [theme.palette.purple[600], theme.palette.purple[300]],
//     stroke: {
//       curve: curve ?? 'monotoneCubic',
//       width: 3,
//     },
//     xaxis: {
//       categories: chart.categories ?? [],
//     },
//     yaxis: {},
//     fill: {
//       type: ['gradient', 'solid'],
//       opacity: [0, 0],
//     },
//     tooltip: {
//       shared: true,
//       intersect: false,
//       marker: {
//         show: true,
//       },
//       followCursor: false,
//       theme: 'light',
//       style: {
//         fontSize: '12px',
//       },
//       custom: ({ series, dataPointIndex, w }) => {
//         const category = chart.categories?.[dataPointIndex] || '';
//         const compareDataValue = compareData?.[dataPointIndex] ?? 0;
//         const isNegative = compareDataValue < 0;
//         const textColor = isNegative ? theme.palette.orange[500] : theme.palette.purple[600];
//         const backgroundColor = isNegative ? theme.palette.orange[50] : theme.palette.purple[50];
//         const compareDataLabel = compareDataValue !== 0 ? `${compareDataValue > 0 ? '+' : ''}${compareDataValue}%` : '0%';
//         let seriesContent = '';
//         let customTooltipKpi = '';
//         series.forEach((seriesData: any, index: any) => {
//           const value = seriesData[dataPointIndex];
//           const seriesName = chart.series[index].name;
//           const markerColor = chart.colors?.[index] || w.config.colors[index];
//           seriesContent += `
//             <div style="display: flex; align-items: center; margin-top: ${theme.spacing(0.5)};">
//               <span style="display: inline-block; width: 10px; height: 10px; background-color: ${markerColor}; border-radius: 50%; margin-right: 8px;"></span>
//              ${seriesName}: ${value}
//             </div>
//           `;
//           customTooltipKpi += `
//             <div style="display: flex; align-items: center; margin-top: ${theme.spacing(0.5)};">
//                 <span style="display: inline-block; width: 10px; height: 10px; background-color: ${markerColor}; border-radius: 50%; margin-right: 8px;"></span>
//                 ${lang('Kpi.CumulativeKpi')} : ${tooltipKpi?.cumulativeKpi}
//               </div>
//               <div style="display: flex; align-items: center; margin-top: ${theme.spacing(0.5)};">
//                 <span style="display: inline-block; width: 10px; height: 10px; background-color: ${markerColor}; border-radius: 50%; margin-right: 8px;"></span>
//                 ${lang('Kpi.TotalFootfall')} : ${tooltipKpi?.totalFootfall}
//               </div>
//               <div style="display: flex; align-items: center; margin-top: ${theme.spacing(0.5)};">
//                 <span style="display: inline-block; width: 10px; height: 10px; background-color: ${markerColor}; border-radius: 50%; margin-right: 8px;"></span>
//                 ${lang('Kpi.KpiIndex')} : ${tooltipKpi?.kpiIndex}
//               </div>
//             `;
//         });

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
//             ${tooltipKpi !== undefined ? customTooltipKpi : ''}
//             ${
//               compareData !== undefined
//                 ? `
//               <div style="margin-top: ${theme.spacing(1)}; display: flex; align-items: center; position: relative; ">
//                 <div style="
//                   display: inline-flex;
//                   align-items: center;
//                   justify-content: center;
//                   width: ${pxToRem(60)};
//                   padding: ${theme.spacing(0.5, 1)};
//                   border-radius: 6px;
//                   color: ${textColor};
//                   background-color: ${backgroundColor};
//                   font-size: ${theme.typography.caption.fontSize};
//                   font-weight: ${theme.typography.fontWeightMedium};
//                 ">
//                   ${compareDataLabel}
//                 </div>
//                 <div style="margin-left: ${theme.spacing(1)};">${compareLabel}</div>
//               </div>`
//                 : ''
//             }

//         `;
//       },
//     },
//     ...chart.options,
//   });
//   return (
//     <Card sx={{ width: '100%', bgcolor: 'transparent', boxShadow: 'none' }}>
//       <Chart series={chart.series} options={chartOptions} type="area" height={height} width={1} />
//     </Card>
//   );
// }
