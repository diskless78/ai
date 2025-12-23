import { Box } from '@mui/material';
import { Logo } from 'src/components/logo';

const SliderLogo: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        top: '55px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 5,
      }}
    >
      <Logo width={119.5} height={29} />
    </Box>
  );
};

export default SliderLogo;
