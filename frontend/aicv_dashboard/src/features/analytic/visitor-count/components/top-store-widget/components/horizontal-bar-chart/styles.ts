import { styled } from '@mui/material/styles';

export const StyledHorizontalBarChart = styled('div')(() => ({
  '& .apexcharts-inner': {
    '& .apexcharts-yaxis.apexcharts-xaxis-inversed > line': {
      display: 'none !important',
    },
    '& .apexcharts-bar-series .apexcharts-data-labels .apexcharts-datalabel': {
      transform: 'translateX(-8px)',
    },
  },
}));
