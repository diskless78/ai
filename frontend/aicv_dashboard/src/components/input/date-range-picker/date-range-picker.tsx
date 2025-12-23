import React, { useState, useMemo, useEffect } from 'react';
import { Popover, useTheme, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import updateLocale from 'dayjs/plugin/updateLocale';
import { pxToRem } from 'src/theme/styles';
import { SvgColor } from 'src/components/svg/svg-color';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import Row from 'src/components/common/row';
import { StyledDateRangePicker, StyledCalendarContainer } from './styles';
import type { DateRangePickerProps } from './types';
import { ETimeFilterType } from 'src/models/common/models.enum';
import { DateRangeCalendar } from './date-range-calendar';

dayjs.extend(quarterOfYear);
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

function DateRangePicker({
  name = '',
  value,
  onChangeValue,
  width = pxToRem(200),
  fullWidth,
  errors,
  placeholder = 'Select date range',
  sx,
}: DateRangePickerProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [fromDate, setFromDate] = useState<Dayjs | null>(
    value?.startDate ? dayjs(value.startDate) : null
  );
  const [toDate, setToDate] = useState<Dayjs | null>(
    value?.endDate ? dayjs(value.endDate) : null
  );
  const [startCalendarDate, setStartCalendarDate] = useState<Dayjs>(
    value?.startDate ? dayjs(value.startDate) : dayjs().subtract(1, 'month')
  );
  const [endCalendarDate, setEndCalendarDate] = useState<Dayjs>(
    value?.endDate ? dayjs(value.endDate) : dayjs()
  );

  useEffect(() => {
    if (value) {
      setFromDate(value.startDate ? dayjs(value.startDate) : null);
      setToDate(value.endDate ? dayjs(value.endDate) : null);
    }
  }, [value]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleStartDateClick = (selectedDate: Dayjs) => {
    setFromDate(selectedDate);

    // Auto-adjust end calendar if needed
    if (!toDate || selectedDate.isAfter(toDate)) {
      setToDate(null);
      setEndCalendarDate(selectedDate.add(1, 'month'));
    }
  };

  const handleEndDateClick = (selectedDate: Dayjs) => {
    if (!fromDate) return;

    let finalStartDate = fromDate;
    let finalEndDate = selectedDate;

    if (selectedDate.isBefore(fromDate)) {
      // Swap dates if end is before start
      finalStartDate = selectedDate;
      finalEndDate = fromDate;
      setFromDate(selectedDate);
      setToDate(fromDate);
    } else {
      setToDate(selectedDate);
    }

    // Only save and close when both dates are selected
    onChangeValue?.({
      startDate: finalStartDate.format('YYYY-MM-DDTHH:mm:ss'),
      endDate: finalEndDate.format('YYYY-MM-DDTHH:mm:ss'),
      timeFilterType: ETimeFilterType.Custom,
    });
    handleClose();
  };

  const displayValue = useMemo(() => {
    if (!value || !value.startDate || !value.endDate) return placeholder;
    if (value && value.startDate && value.endDate) {
      return `${dayjs(value.startDate).format('DD/MM/YYYY')} - ${dayjs(value.endDate).format('DD/MM/YYYY')}`;
    }
  }, [placeholder, value]);

  return (
    <>
      <StyledDateRangePicker
        ownerState={{
          width,
          fullWidth,
          colorType: errors?.[name]?.message ? 'error' : 'normal',
        }}
        className={open ? 'Mui-focused' : ''}
        sx={sx}
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
      </StyledDateRangePicker>

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
        {/* Dual Calendars */}
        <StyledCalendarContainer id='date-range-picker-calendars'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Row sx={{ p: pxToRem(12), gap: pxToRem(16) }}>
              {/* Start Date Calendar (Left) */}
              <DateRangeCalendar
                value={startCalendarDate}
                onChange={setStartCalendarDate}
                fromDate={fromDate}
                toDate={toDate}
                isCustomMode={true}
                onDateClick={handleStartDateClick}
                isStartCalendar={true}
              />

              {/* End Date Calendar (Right) */}
              <DateRangeCalendar
                value={endCalendarDate}
                onChange={setEndCalendarDate}
                fromDate={fromDate}
                toDate={toDate}
                isCustomMode={true}
                onDateClick={handleEndDateClick}
                isStartCalendar={false}
              />
            </Row>
          </LocalizationProvider>
        </StyledCalendarContainer>
      </Popover>
    </>
  );
}

export default React.memo(DateRangePicker);
