import { Box, Modal, useTheme, Typography } from '@mui/material';
import Column from 'src/components/common/column';
import { pxToRem } from 'src/theme/styles';
import SvgImage from 'src/components/svg/svg-image/svg-image';
import { SvgColor } from 'src/components/svg/svg-color';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';

export default function MobileModal() {
  const theme = useTheme();

  return (
    <Modal
      open
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& .MuiBackdrop-root': {
          backgroundColor: 'background.paper95',
        },
      }}
    >
      <Column
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: 'background.paper95',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ position: 'absolute', top: pxToRem(154) }}>
          <SvgImage
            width={137.51}
            height={33.51}
            src={
              theme.palette.mode === 'dark'
                ? ASSET_CONSTANT.SVG.LogoFullWhite
                : ASSET_CONSTANT.SVG.LogoFullLight
            }
          />
        </Box>
        <Column
          justifyContent='space-between'
          gap={pxToRem(12)}
          paddingBottom={pxToRem(37)}
        >
          <Typography
            variant='h1'
            color='text.heading'
            textAlign='center'
            sx={{
              fontWeight: 700,
              lineHeight: 52.5 / 35,
              fontSize: pxToRem(35),
            }}
          >
            COMING SOON
          </Typography>
          <Typography variant='t1SemiBold' color='text.body' textAlign='center'>
            {`The software isn't working on the mobile version.`}
          </Typography>
        </Column>
        <SvgColor
          sx={{
            position: 'absolute',
            bottom: -265,
          }}
          src={ASSET_CONSTANT.SVG.LogoSingle}
          width={429}
          height={525.17}
          opacity={0.2}
          color='background.tabprimary'
        />
      </Column>
    </Modal>
  );
}
