import React from 'react';
import { Paper, styled, Typography } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import SizedBox from 'src/components/common/sized-box';
import Row from 'src/components/common/row';
import Column from 'src/components/common/column';
import AlertListItemStatusBar from './alert-list-item-status-bar';
import AlertListItemIndicatorDot from './alert-list-item-indicator-dot';

export interface AlertItem {
  title: string;
  description: string;
  time: string;
  status: 'critical' | 'warning' | 'info';
}

const statusColors = {
  critical: 'orange.80',
  warning: 'orange.50',
  info: 'blue.50',
};

const StyledAlertListItem = styled(Paper)(({ theme }) => ({
  padding: `${pxToRem(8)} ${pxToRem(0)} ${pxToRem(8)} ${pxToRem(15)}`,
  borderRadius: pxToRem(8),
  position: 'relative',
  cursor: 'pointer',
  border: '1px solid',
  borderColor: theme.palette.neutral?.[10],
  backgroundColor: theme.palette.neutral?.black2,
})) as typeof Paper;

const AlertListItem: React.FC<{ item: AlertItem }> = ({ item }) => {
  return (
    <StyledAlertListItem elevation={0}>
      <AlertListItemStatusBar color={statusColors[item.status]} />
      <AlertListItemIndicatorDot />
      <Typography variant='t4Bold'>{item.title}</Typography>
      <SizedBox height={2} />
      <Row justifyContent='space-between'>
        <Typography fontSize={10} lineHeight={1.5} color='neutral.60'>
          {item.description}
        </Typography>
        <Column justifyContent='flex-end'>
          <Typography
            fontSize={10}
            lineHeight={1.5}
            color='neutral.60'
            sx={{
              paddingRight: pxToRem(10),
              paddingLeft: pxToRem(10),
            }}
          >
            {item.time}
          </Typography>
        </Column>
      </Row>
    </StyledAlertListItem>
  );
};

export default AlertListItem;
