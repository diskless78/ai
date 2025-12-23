import { Box, keyframes } from '@mui/material';

const scanAnimation = keyframes`
  0% {
    transform: translateY(-90%);
  }
  100% {
    transform: translateY(90%);
  }
`;

export default function ScanEffect() {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(180deg, rgba(113, 127, 253, 0) 0%, rgba(113, 127, 253, 0.4) 50%, rgba(113, 127, 253, 0) 100%)',
        mixBlendMode: 'screen',
        animation: `${scanAnimation} 3s linear infinite alternate`,
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: '100%',
          height: 2,
          background: 'white',
          boxShadow: '0px 0px 12px 4px #FFFFFF40',
          zIndex: 2,
        }}
      />
    </Box>
  );
}
