import { Box, Typography } from '@mui/material';

const SliderDescription: React.FC = () => {
  return (
    <Box
      className='progress-bar'
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '380px',
        position: 'absolute',
        bottom: '70px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 5,
      }}
    >
      <Typography variant='b3Medium' color='neutral.0' textAlign='center'>
        We specialize in AI Video Analytics & Real-time Solutions serve a wide
        range of key industries.
      </Typography>
    </Box>
  );
};

export default SliderDescription;
