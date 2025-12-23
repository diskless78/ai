// import { Heatmap, HeatmapConfig } from '@ant-design/plots';
// import Column from 'src/components/common/column';
// import './heatmap.css';

// type Props = {
//   chart: {
//     series: {
//       g: number;
//       l: number;
//       value: number;
//     }[];
//     options?: HeatmapConfig;
//   };
//   colors?: string[];
//   image: string;
//   size?: { xs?: string; sm?: string; md?: string; lg?: string; xl?: string };
// };

// export default function HeatmapChart({ chart, size, image, colors }: Props) {
//   const chartData = chart?.series;
//   const chartColors = colors ?? [
//     'rgb(0,0,50)',
//     'rgb(0,0,150)',
//     'rgb(0,255,0)',
//     'rgb(255,255,0)',
//     'rgb(255,0,0)',
//   ];

//   const heatmapOptions: HeatmapConfig = {
//     data: chartData,
//     type: "density",
//     xField: 'g',
//     yField: 'l',
//     colorField: 'value',
//     color: chartColors,
//     legend: { position: 'bottom' },

//     xAxis: { label: null, max: 700, min: 0, nice: false },
//     yAxis: { label: null, max: 500, min: 0, nice: false },
//     annotations: [
//       {
//         type: 'image',
//         start: ['min', 'max'],
//         end: ['max', 'min'],
//         src: image,
//       },
//     ],
//     tooltip: {
//       customContent: (_: any, items: any) =>
//         `<div class="time-heatmap">${items
//           .map((item: any) => `<div>${item.value}s</div>`)
//           .join('')}</div>`,
//     },
//     ...chart.options,
//   };

//   return (
//     <Column sx={{height:"100%"}}>
//       <Heatmap {...heatmapOptions} style={{height: "570px"}} />
//     </Column>
//   );
// }
