import React, { useState, useMemo, useEffect } from 'react';
import { Popover, useTheme, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import { pxToRem } from 'src/theme/styles';
import { SvgColor } from '../../svg/svg-color';
import { StyledInputDatePicker, StyledCalendarContainer } from './styles';
import type { InputDatePickerProps } from './types';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { SingleDateCalendar } from './single-date-calendar';

dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  weekStart: 1,
});

const IconCalendar = React.memo(() => (
  <SvgColor
    width={pxToRem(20)}
    height={pxToRem(20)}
    src={ASSET_CONSTANT.SVG.IconLinearCalendar}
    color='neutral.80'
  />
));

export default function InputDatePicker({
  value,
  onChangeValue,
  field,
  width = pxToRem(200),
  fullWidth,
}: InputDatePickerProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    value ? dayjs(value) : null
  );
  const [calendarDate, setCalendarDate] = useState<Dayjs>(
    value ? dayjs(value) : dayjs()
  );

  useEffect(() => {
    setSelectedDate(value ? dayjs(value) : null);
  }, [value]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleDateClick = (date: Dayjs) => {
    setSelectedDate(date);
    onChangeValue?.(date.format('YYYY-MM-DDTHH:mm:ss'));
    handleClose();
  };

  const displayValue = useMemo(() => {
    if (!value) return 'Select date';
    return dayjs(value).format('DD/MM/YYYY');
  }, [value]);

  return (
    <>
      <StyledInputDatePicker
        ownerState={{
          width,
          fullWidth,
          colorType: 'normal',
        }}
        className={open ? 'Mui-focused' : ''}
        onClick={handleClick}
      >
        <IconCalendar />
        <Typography variant='b3Regular' sx={{ ml: pxToRem(8), flex: 1 }}>
          {displayValue}
        </Typography>
        <SvgColor
          src={ASSET_CONSTANT.SVG.IconLinearArrowDown}
          width={pxToRem(20)}
          height={pxToRem(20)}
          color='neutral.80'
        />
      </StyledInputDatePicker>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        disableRestoreFocus
        disableEnforceFocus
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: pxToRem(12),
              boxShadow: theme.customShadows.card0,
              border: `1px solid ${theme.palette.neutral[20]}`,
            },
          },
        }}
      >
        <StyledCalendarContainer id='input-date-picker-calendar'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <SingleDateCalendar
              value={calendarDate}
              onChange={setCalendarDate}
              selectedDate={selectedDate}
              onDateClick={handleDateClick}
            />
          </LocalizationProvider>
        </StyledCalendarContainer>
      </Popover>
    </>
  );
}
