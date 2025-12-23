import { Box } from '@mui/material';
import { pxToRem } from 'src/theme/styles';

const AlertListItemIndicatorDot: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        right: pxToRem(10),
        top: pxToRem(10),
        width: pxToRem(6),
        height: pxToRem(6),
        borderRadius: pxToRem(12),
        backgroundColor: 'green.60',
      }}
    />
  );
};

export default AlertListItemIndicatorDot;
