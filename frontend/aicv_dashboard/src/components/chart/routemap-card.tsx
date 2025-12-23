import { Grid, Typography } from '@mui/material';
import Column from 'src/components/common/column';
import Row from 'src/components/common/row';
import { pxToRem } from 'src/theme/styles';
import ArrowImage from '../chart/route-chart';
import dayjs from 'dayjs';

type Props = {
  titlheader: string;
  setGoupIDRequest?: any;
};

export default function RoutemapChartCard({ titlheader }: Props) {
  // HARDCODED DATA FOR TESTING
  const MOCK_ROUTE_MAP_DATA = {
    image:
      'https://s3.cxview.ai/product-camera-image/06d14737-3d52-4565-8e1c-18825b9b354f.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=prod-admin-service%2F20251201%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251201T025252Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=2e69ac6cf48d9d130c83cf86383f3b6a63498ada93c4b2347589bd249ef4e560',
    name: 'Marou Lê Thánh Tôn Camera 02',
    percentage: [
      {
        fill: 'white',
        text: '33.33%',
        total_people: 36,
        x: 0.634,
        y: 0.526,
      },
      {
        fill: 'white',
        text: '33.33%',
        total_people: 10,
        x: 0.439,
        y: 0.378,
      },
    ],
    routes: [
      {
        active: true,
        color: 'green',
        end: [0.634, 0.526],
        id: 'dd4544ab-b406-41cc-a708-2dd0c1a589d6',
        mid: [0.449, 0.701],
        name: 'LTT - Shopping - Right',
        start: [0.263, 0.875],
        value: 36,
      },
      {
        active: true,
        color: 'green',
        end: [0.439, 0.378],
        id: '11887497-c36c-4da5-b545-470a8c11ee71',
        mid: [0.351, 0.627],
        name: 'LTT - Shopping - Left',
        start: [0.263, 0.875],
        value: 10,
      },
    ],
  };

  const todayRange = dayjs();
  const formattedDate = todayRange.format('DD/MM/YYYY');

  return (
    <Column
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: 'background.section',
        padding: `${pxToRem(16)} ${pxToRem(16)} ${pxToRem(8)} ${pxToRem(8)}`,
        border: '1px solid',
        borderColor: 'var(--layout-nav-border-card)',
        borderRadius: pxToRem(12),
      }}
    >
      <Row
        gap={pxToRem(6)}
        paddingLeft={pxToRem(8)}
        alignItems="center"
        sx={{ borderBottom: '1px solid var(--layout-nav-border-card)', pb: pxToRem(12) }}
      >
        <Grid
          container
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Grid sx={{ display: 'column', alignItems: 'center' }}>
            <Typography variant="h2">{titlheader}</Typography>
            <Typography variant="inherit" flex={1}>
              Route Map Report - {formattedDate} (Mock Data)
            </Typography>
          </Grid>
        </Grid>
      </Row>
      <Row sx={{ padding: pxToRem(24), justifyContent: 'center' }}>
        <Grid
          sx={{
            position: 'relative',
            width: '836px',
            height: '550px',
            backgroundImage: `url(${MOCK_ROUTE_MAP_DATA.image})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            borderRadius: '8px',
          }}
        >
          <Grid
            sx={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              padding: `${pxToRem(8)} ${pxToRem(16)}`,
              borderRadius: pxToRem(8),
            }}
          >
            <Typography variant="h6" color="white">
              {MOCK_ROUTE_MAP_DATA.name}
            </Typography>
          </Grid>
          {MOCK_ROUTE_MAP_DATA.routes.map((route: any, routeIndex: number) => (
            <ArrowImage
              key={routeIndex}
              x1={route.start[0]}
              y1={route.start[1]}
              x2={route.end[0]}
              y2={route.end[1]}
              x3={route.mid[0]}
              y3={route.mid[1]}
              color={route.color}
              valueX={MOCK_ROUTE_MAP_DATA.percentage[routeIndex]?.x}
              valueY={MOCK_ROUTE_MAP_DATA.percentage[routeIndex]?.y}
              value={MOCK_ROUTE_MAP_DATA.percentage[routeIndex]?.text}
              fontSize={100}
              index={route.id}
            />
          ))}
        </Grid>
      </Row>
    </Column>
  );
}
