import { Box, type BoxProps } from '@mui/material';
import React from 'react';

type ColumnProps = {
  children?: React.ReactNode;
};

const Column = React.forwardRef<HTMLDivElement, BoxProps & ColumnProps>(
  ({ children, ...other }, ref) => (
    <Box display='flex' flexDirection='column' ref={ref} {...other}>
      {children}
    </Box>
  )
);

export default Column;
