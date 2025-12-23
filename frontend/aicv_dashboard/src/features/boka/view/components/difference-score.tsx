import { Box, Paper, Typography } from '@mui/material';
import SizedBox from 'src/components/common/sized-box';
import { useLanguage } from 'src/i18n/i18n';
import { pxToRem } from 'src/theme/styles';

type Props = {
  action: string;
};

export function DifferenceScore({ action }: Props) {
  const lang = useLanguage();

  const backgroundColor =
    action === 'pass'
      ? 'green.20'
      : action === 'recheck'
        ? 'orange.10'
        : 'red.10';

  const textColor =
    action === 'pass'
      ? 'green.80'
      : action === 'recheck'
        ? 'orange.70'
        : 'red.70';

  const borderColor =
    action === 'pass'
      ? 'green.30'
      : action === 'recheck'
        ? 'orange.20'
        : 'red.20';

  const result =
    action === 'pass'
      ? lang('ColorCheck.Pass')
      : action === 'recheck'
        ? lang('ColorCheck.ReCheck')
        : lang('ColorCheck.Fail');

  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: pxToRem(9),
        backgroundColor: backgroundColor,
        border: '1px solid',
        borderColor: borderColor,
        p: `${pxToRem(24)} ${pxToRem(24)} ${pxToRem(44)} ${pxToRem(24)}`,
      }}
    >
      <Box
        display='inline-block'
        padding={`${pxToRem(4)} ${pxToRem(12)}`}
        border='1px solid'
        borderColor='neutral.20'
        bgcolor='neutral.0'
        borderRadius={pxToRem(12)}
      >
        <Typography variant='t3SemiBold' color='neutral.100'>
          {lang(`ColorCheck.Result`)}
        </Typography>
      </Box>
      <SizedBox height={24} />
      <Typography
        color={textColor}
        fontWeight={400}
        fontSize={50}
        lineHeight='120%'
      >
        {result.toUpperCase()}
      </Typography>
    </Paper>
  );
}
