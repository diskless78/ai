import { styled } from '@mui/material/styles';
import Row from 'src/components/common/row';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { pxToRem } from 'src/theme/styles';

export const StyledLoginView = styled(Row)(({ theme }) => {
  const styles = {};

  return {
    overflow: 'hidden',
    '& .left-side': {
      position: 'relative',
      display: 'flex',
      width: `calc(100% - ${pxToRem(710)})`, // lg: 8/12 (66.67%)
      padding: 0,
      backgroundColor: '#F2F2F2',
      // alignItems: 'center',
      justifyContent: 'center',
      '& .left-background-image': {
        position: 'absolute',
        top: '0',
        width: pxToRem(2041.2),
        height: '100vh',
        left: theme.palette.mode === 'dark' ? '0px' : pxToRem(203),
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(${ASSET_CONSTANT.IMAGE.BackgroundLoginLight})`,
      },
      '& .left-section-login': {
        position: 'absolute',
        top: 98,
        left: 89,
        '& .logan': {
          fontWeight: 500,
          lineHeight: 72.68 / 62.65,
          fontSize: pxToRem(62.65),
          textAlign: 'left',
          whiteSpace: 'pre-line',
          background: 'linear-gradient(270deg, #A094DB 0%, #6351BB 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        },
        '& .logo-left-side': {},
      },
    },
    '& .right-side': {
      position: 'relative',
      display: 'flex',
      width: pxToRem(710),
      justifyContent: 'center',
      backgroundColor: theme.palette.common.white,
      overflow: 'hidden',
      '& .right-section-login': {
        height: '100vh',
        width: '100%',
        maxWidth: pxToRem(426),
        justifyContent: 'center',
      },
      '& .logo-right-side': {
        position: 'absolute',
        width: pxToRem(369),
        bottom: pxToRem(60),
      },
    },

    ...styles,
  };
});
