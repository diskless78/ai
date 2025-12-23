import React from 'react';
import { Box } from '@mui/material';

interface OverlayErrorBoxProps {
  data: number[][];
  threshold_lv1: number;
  threshold_lv2: number;
  action: string;
}

const OverlayErrorBox: React.FC<OverlayErrorBoxProps> = ({
  data,
  threshold_lv2,
}) => {
  const rows = data.length;
  const cols = data[0]?.length || 0;

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        pointerEvents: 'none', // không ảnh hưởng click ảnh gốc
      }}
    >
      {data.map((row, rowIndex) =>
        row.map((value, colIndex) => (
          <Box
            key={`${rowIndex}-${colIndex}`}
            sx={{
              width: '100%',
              height: '100%',
              // border: `1px solid ${value > threshold_lv2 ? '#F05246' : value > threshold_lv1 ? '#FFD8BE' : 'transparent'}`,
              border: `1px solid ${value > threshold_lv2 ? '#F05246' : 'transparent'}`,
              borderRadius: '2px',
              bgcolor: value > threshold_lv2 ? '#FFA1A11A' : 'transparent',
              boxSizing: 'border-box',
            }}
          />
        ))
      )}
    </Box>
  );
};

export default OverlayErrorBox;
