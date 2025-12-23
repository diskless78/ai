import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import Row from 'src/components/common/row';

const DateTimeNow: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = currentTime.toLocaleTimeString('en-US', {
    hour12: true,
  });

  const dateString = currentTime.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <Row
      sx={{
        alignItems: 'center',
        bgcolor: 'purple.10',
        borderRadius: pxToRem(4),
        gap: pxToRem(10),
        paddingBlock: pxToRem(6.5),
        paddingInline: pxToRem(10),
      }}
    >
      <Typography
        variant='t3Bold'
        color='purple.90'
        minWidth={pxToRem(82)}
        textAlign='center'
      >
        {timeString}
      </Typography>
      <Box sx={{ width: '1px', height: '6px', bgcolor: 'purple.40' }} />
      <Typography variant='b3Medium' color='purple.90'>
        {dateString.charAt(0).toUpperCase() + dateString.slice(1)}
      </Typography>
    </Row>
  );
};

export default DateTimeNow;
