import { Box } from '@mui/material';

export default function DashedBorder() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '200px',
        height: '200px',
        '&::after': {
          //  height: '1px',
          backgroundImage:
            'repeating-linear-gradient(0deg, white, white 4px, transparent 4px, transparent 8px, white 8px), ' +
            'repeating-linear-gradient(90deg, white, white 4px, transparent 4px, transparent 8px, white 8px), ' +
            'repeating-linear-gradient(180deg, white, white 4px, transparent 4px, transparent 8px, white 8px), ' +
            'repeating-linear-gradient(270deg, white, white 4px, transparent 4px, transparent 8px, white 8px)',
          backgroundSize: '4px 100%, 100% 4px, 4px 100%, 100% 4px',
          content: '""',
          width: '100%',
          opacity: '.2',
          position: 'absolute',
          bottom: '0',
          left: '0',
          backgroundPosition: '0 0',
          backgroundRepeat: 'no-repeat',
        },
      }}
    />
  );
}
