import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import AlertFilterTabs from './alert-filter-tabs';
import SizedBox from 'src/components/common/sized-box';
import { pxToRem } from 'src/theme/styles';
import Column from 'src/components/common/column';
import CameraPreview from 'src/components/image/camera-preview/camera-preview';

const AlertCenterWidget: React.FC = () => {
  const [filter, setFilter] = React.useState<
    'critical' | 'warning' | 'info' | 'all'
  >('all');

  // const filteredAlerts =
  //   filter === 'all'
  //     ? mockAlerts
  //     : mockAlerts.filter((item) => item.status === filter);

  return (
    <Column
      height={{ xs: 'auto', md: pxToRem(384) }}
      justifyContent='space-between'
    >
      <Typography variant='h3' color='red.60'>
        Alert center
      </Typography>

      <Grid
        container
        spacing={pxToRem(15)}
        sx={{ height: `calc(100% - ${pxToRem(46)})` }}
      >
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
          sx={{ height: '100%' }}
        >
          <Column sx={{ height: '100%', minHeight: 0 }}>
            <AlertFilterTabs filter={filter} onChange={setFilter} />
            <SizedBox height={15} />

            <Typography variant='t4Bold'>
              Great! There are currently no issues or warnings that need your
              attention.
            </Typography>

            {/* <Scrollbar sx={{ flex: 1, minHeight: 0 }}>
              <Column gap={pxToRem(8)}>
                {filteredAlerts.map((alert, index) => (
                  <AlertListItem key={index} item={alert} />
                ))}
              </Column>
            </Scrollbar> */}
          </Column>
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
          sx={{ height: '100%' }}
        >
          <Paper
            elevation={0}
            sx={{
              height: '100%',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <CameraPreview borderRadius={pxToRem(8)} fit='cover' />

            {/* <Column
              sx={{
                position: 'absolute',
                top: 10,
                right: 13,
                p: `${pxToRem(4)} ${pxToRem(12)}`,
                borderRadius: pxToRem(12),
                backgroundColor: '#FFFFFF5C', //#0000005C
                // backdropFilter: 'blur(19px)',
              }}
            >
              <Typography variant='t4Bold' color='white'>
                Aisle A3
              </Typography>
            </Column> */}
          </Paper>
        </Grid>
      </Grid>
    </Column>
  );
};

export default React.memo(AlertCenterWidget);
