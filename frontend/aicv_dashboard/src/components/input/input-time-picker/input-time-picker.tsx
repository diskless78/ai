import { LocalizationProvider } from '@mui/x-date-pickers';
import { useState, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { pxToRem } from 'src/theme/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fTime, cTimeToDate } from 'src/utils/format-time';
import { SvgColor } from '../../svg/svg-color';
import { StyledTimePicker } from './styles';
import type { InputTimePickerProps } from './types';

export default function InputTimePicker({
  value,
  onChangeValue,
  size = 'medium',
  field,
  width = pxToRem(200),
  fullWidth,
}: InputTimePickerProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    field?.value || value ? cTimeToDate(field?.value ?? value) : null
  );

  useEffect(() => {
    setSelectedDate(
      field?.value || value ? cTimeToDate(field?.value ?? value) : null
    );
  }, [field?.value, value]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box onClick={handleOpen}>
        <StyledTimePicker
          ampm={false}
          theme={theme}
          ownerState={{ size, width, fullWidth }}
          open={open}
          onOpen={handleOpen}
          onClose={handleClose}
          value={selectedDate}
          onChange={(newValue) => {
            const valueString = fTime(newValue, 'HH:mm');
            if (valueString) {
              field?.onChange(valueString);
              onChangeValue && onChangeValue(valueString);
            }
          }}
          // onAccept={(newValue: any) => {
          //   console.log('onAccept: ');
          //   // setSelectedDate(newValue);
          //   handleClose();
          // }}
          slotProps={{
            textField: {
              InputProps: {
                readOnly: true,
                startAdornment: (
                  <SvgColor
                    className='icon'
                    width={pxToRem(20)}
                    height={pxToRem(20)}
                    src={ASSET_CONSTANT.SVG.IconLineTimer}
                  />
                ),
                endAdornment: null,
              },
            },
            popper: {
              sx: {
                '& .MuiList-root': {
                  '&::-webkit-scrollbar': {
                    width: '3px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    borderRadius: '7px',
                    backgroundColor: theme.palette.neutral[700],
                  },
                },
              },
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}
