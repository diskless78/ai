import { Box, type BoxProps } from '@mui/material';
import React from 'react';

type RowProps = {
  children?: React.ReactNode;
};

const Row = React.forwardRef<HTMLDivElement, BoxProps & RowProps>(
  ({ children, ...other }, ref) => (
    <Box display='flex' flexDirection='row' ref={ref} {...other}>
      {children}
    </Box>
  )
);

export default Row;
