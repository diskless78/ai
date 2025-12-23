import { Box, Typography } from '@mui/material';
import Column from 'src/components/common/column';
import { useLanguage } from 'src/i18n/i18n';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import Row from 'src/components/common/row';
import SizedBox from 'src/components/common/sized-box';
import LoginForm from './components/login-form';
import { StyledLoginView } from './styles';
import { SliderLogin } from './components/slider/slider-login';

export function LoginView() {
  const lang = useLanguage();

  return (
    <StyledLoginView sx={{ height: '100vh' }}>
      <Box className='left-side'>
        <SliderLogin />
      </Box>
      <Box className='right-side'>
        <Column className='right-section-login'>
          <Row justifyContent='center'>
            <Box
              justifySelf='center'
              alt='Full logo'
              component='img'
              src={ASSET_CONSTANT.SVG.LogoSquare}
              width={80}
              height={80}
            />
          </Row>
          <SizedBox height={40} />
          <Typography variant='h1' color='neutral.100' textAlign='center'>
            {lang('Login.LoginToSystem')}
          </Typography>
          <SizedBox height={12} />
          <Typography variant='b3Medium' color='neutral.70' textAlign='center'>
            Welcome to CXVIEW AI! We’re glad to have you here — have a wonderful
            and productive day!
          </Typography>
          <SizedBox height={40} />
          <LoginForm />
          <SizedBox height={40} />
        </Column>
      </Box>
    </StyledLoginView>
  );
}
