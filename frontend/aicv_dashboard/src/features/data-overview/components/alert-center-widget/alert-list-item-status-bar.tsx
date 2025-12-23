import { Box } from '@mui/material';
import { pxToRem } from 'src/theme/styles';

const AlertListItemStatusBar: React.FC<{
  color: string;
}> = ({ color }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        top: pxToRem(8),
        width: pxToRem(3),
        height: pxToRem(38),
        borderRadius: pxToRem(12),
        backgroundColor: color,
      }}
    />
  );
};

export default AlertListItemStatusBar;
