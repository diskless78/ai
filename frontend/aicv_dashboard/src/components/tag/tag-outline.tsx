import { Box, Typography } from '@mui/material';
import { pxToRem } from 'src/theme/styles';

type TagOutlineProps = {
  label: string;
};

export default function TagOutline({ label }: TagOutlineProps) {
  return (
    <Box
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.04)',
        px: pxToRem(12),
        py: pxToRem(4),
        borderRadius: pxToRem(12),
        border: '1px solid #53468D',
      }}
    >
      <Typography variant='t3SemiBold'>{label}</Typography>
    </Box>
  );
}
