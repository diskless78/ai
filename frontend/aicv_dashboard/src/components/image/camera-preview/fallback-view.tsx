import { Box, Typography } from '@mui/material';
import Column from 'src/components/common/column';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { useLanguage } from 'src/i18n/i18n';
import { pxToRem } from 'src/theme/styles';

type Props = {
  placeholder?: string;
};

const FallbackView = ({ placeholder }: Props) => {
  const lang = useLanguage();
  return (
    <Column
      component='div'
      position='absolute'
      top={0}
      left={0}
      right={0}
      bottom={0}
      display='flex'
      alignItems='center'
      justifyContent='center'
    >
      <Box
        component='img'
        src={ASSET_CONSTANT.IMAGE.NotFindData}
        sx={{
          width: '35%',
          maxWidth: pxToRem(165),
          height: 'auto',
        }}
      />
      <Typography
        variant='t2SemiBold'
        color='neutral.100'
        sx={{
          fontSize: `clamp(${pxToRem(12)}, 1.6vw, ${pxToRem(16)})`,
          textAlign: 'center',
        }}
      >
        {placeholder || lang('Common.NoDataToDisplayYet')}
      </Typography>
    </Column>
  );
};

export default FallbackView;
