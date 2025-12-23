import { Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledBaseCheckbox = styled(Checkbox)(({ theme }) => {
  const defaultStyle = {};

  return {
    color: theme.palette.primary.main, // Color for unchecked state
    '&.Mui-checked': {
      color: theme.palette.secondary.main, // Color for checked state
    },
    '& .MuiSvgIcon-root': {
      fontSize: 28, // Customize the size of the icon
    },
    '& .MuiTouchRipple-root': {
      color: theme.palette.blue[60], // Ripple effect color
    },

    ...defaultStyle,
  };
});
