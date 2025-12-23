import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Logo } from 'src/components/logo';
import BaseButton from 'src/components/button/base-button/base-button';
import { pxToRem } from 'src/theme/styles';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';

export function NotFoundView() {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        px: pxToRem(16),
        zIndex: 5,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: pxToRem(40),
          left: pxToRem(60),
        }}
      >
        <Logo width={128} height={32} />
      </Box>

      {/* Main content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 1,
          textAlign: 'center',
          position: 'fixed',
          top: pxToRem(94),
        }}
      >
        <Typography
          variant='h1'
          sx={{
            mb: pxToRem(12),
            fontWeight: 600,
          }}
        >
          Whoops, Page Not Found
        </Typography>

        <Typography
          variant='t2SemiBold'
          sx={{
            mb: pxToRem(32),
            color: 'text.secondary',
          }}
        >
          Something went wrong. Let's get you back on track.
        </Typography>

        <BaseButton
          text='Back to Dashboard'
          size='medium'
          color='primary'
          variant='contained'
          onClick={handleBackToDashboard}
        />
      </Box>

      <Box
        component='img'
        src={ASSET_CONSTANT.SVG.Text404}
        alt='404'
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
          maxWidth: pxToRem(800),
          height: 'auto',
          zIndex: 0,
          opacity: 1,
        }}
      />

      <Box
        component='img'
        src={ASSET_CONSTANT.SVG.BottomGradient404}
        alt=''
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: 'auto',
          zIndex: -1,
        }}
      />
    </Box>
  );
}
