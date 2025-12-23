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
// };

// export default function RadarChart({ chart, height }: Props) {
//   const theme = useTheme();

//   const chartOptions = useChart({
//     chart: {
//       type: 'radar',
//     },
//     colors: chart.colors ?? [
//       theme.palette.purple[600],
//       theme.palette.purple[300],
//     ],
//     xaxis: {
//       categories: chart.categories ?? [],
//     },
//     stroke: {
//       width: 2,
//     },
//     fill: {
//       opacity: 0.1,
//     },
//     markers: {
//       size: 4,
//     },
//     tooltip: {
//       theme: 'light',
//     },
//     ...chart.options,
//   });

//   return (
//     <Card sx={{ width: '100%', bgcolor: 'transparent', boxShadow: 'none' }}>
//       <Chart
//         series={chart.series}
//         options={chartOptions}
//         type='radar'
//         height={height}
//         width={1}
//       />
//     </Card>
//   );
// }
