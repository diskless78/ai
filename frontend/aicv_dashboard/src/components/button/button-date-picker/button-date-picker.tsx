import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { pxToRem } from 'src/theme/styles';
import { Box, useTheme } from '@mui/material';
import { SvgColor } from '../../svg/svg-color';
import { StyledButtonDatePicker } from './styles';
import type { ButtonDatePickerProps } from './types';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';

function ButtonDatePicker({ type, onChange }: ButtonDatePickerProps) {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box onClick={handleOpen}>
        <StyledButtonDatePicker
          theme={theme}
          ownerState={{ type }}
          open={open}
          onClose={handleClose}
          value={selectedDate}
          onChange={(newValue: any) => {
            setSelectedDate(newValue);
            handleClose();
            if (onChange) {
              onChange(newValue);
            }
          }}
          slotProps={{
            textField: {
              disabled: true,
              InputProps: {
                endAdornment:
                  type === 'button' ? (
                    <IconButton onClick={handleOpen} className='icon'>
                      <SvgColor
                        width={pxToRem(24)}
                        height={pxToRem(24)}
                        src={ASSET_CONSTANT.SVG.IconBoldCalendar}
                        color='text.body'
                        opacity={0.5}
                      />
                    </IconButton>
                  ) : null,
              },
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}

export default ButtonDatePicker;
