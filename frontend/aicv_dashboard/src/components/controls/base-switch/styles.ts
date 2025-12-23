import { Switch } from '@mui/material';
import { type Theme, styled } from '@mui/material/styles';
import { pxToRem } from 'src/theme/styles';

export const StyledBaseSwitch = styled(Switch)(({
  theme,
}: {
  theme: Theme;
}) => {
  const defaultStyle = {};

  return {
    width: pxToRem(30.38),
    height: pxToRem(16.88),
    borderRadius: 20 / 2,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      transform: `translateX(0px)`,
      '&.Mui-checked': {
        color: '#fff',
        transform: `translateX(${pxToRem(13.5)})`,
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.pink[500],
          opacity: 1,
          border: 0,
        },
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: theme.palette.pink[100],
      width: pxToRem(16.88),
      height: pxToRem(16.88),
      boxShadow: '-1px 0.84px 1.69px 0px #00000033',
    },
    '& .MuiSwitch-track': {
      borderRadius: 20 / 2,
      backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },

    ...defaultStyle,
  };
});
