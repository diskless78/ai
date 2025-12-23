import React, { useState, useMemo, useEffect } from 'react';
import { Box, Typography, Popover, useTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import updateLocale from 'dayjs/plugin/updateLocale';
import { pxToRem } from 'src/theme/styles';
import { SvgColor } from 'src/components/svg/svg-color';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import Row from 'src/components/common/row';
import Column from 'src/components/common/column';
import {
  StyledInputSelectDate,
  StyledPresetOption,
  StyledDateRangeDisplay,
  StyledCalendarContainer,
} from './styles';
import type { InputSelectDateProps, DateRangePreset } from './types';
import { ETimeFilterType } from 'src/models/common/models.enum';

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

const DATE_PRESETS: DateRangePreset[] = [
  { id: ETimeFilterType.Today, label: 'Today' },
  { id: ETimeFilterType.CurrentWeek, label: 'Current week' },
  { id: ETimeFilterType.CurrentMonth, label: 'Current month' },
  { id: ETimeFilterType.CurrentQuarter, label: 'Current quarter' },
  { id: ETimeFilterType.CurrentYear, label: 'Current year' },
  { id: ETimeFilterType.Custom, label: 'Custom range' },
];

function InputSelectDate({
  name = '',
  value,
  onChangeValue,
  width = pxToRem(200),
  fullWidth,
  errors,
  placeholder = 'Select date range',
  sx,
}: InputSelectDateProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPreset, setSelectedPreset] = useState<ETimeFilterType>(
    value?.timeFilterType || ETimeFilterType.Custom
  );
  const [fromDate, setFromDate] = useState<Dayjs | null>(
    value?.startDate ? dayjs(value.startDate) : dayjs().subtract(7, 'day')
  );
  const [toDate, setToDate] = useState<Dayjs | null>(
    value?.endDate ? dayjs(value.endDate) : dayjs()
  );
  const [referenceDate, setReferenceDate] = useState<Dayjs>(dayjs());

  useEffect(() => {
    if (value) {
      setFromDate(value.startDate ? dayjs(value.startDate) : null);
      setToDate(value.endDate ? dayjs(value.endDate) : null);
      if (value.timeFilterType) {
        setSelectedPreset(value.timeFilterType);
      }
    }
  }, [value]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handlePresetSelect = (presetId: ETimeFilterType) => {
    setSelectedPreset(presetId);
    const today = dayjs();

    if (presetId === ETimeFilterType.Custom) return;

    let newFrom: Dayjs | null = null;
    let newTo: Dayjs | null = null;

    switch (presetId) {
      case ETimeFilterType.Today:
        newFrom = today;
        newTo = today;
        break;
      case ETimeFilterType.CurrentWeek:
        newFrom = today.startOf('week');
        newTo = today;
        break;
      case ETimeFilterType.CurrentMonth:
        newFrom = today.startOf('month');
        newTo = today;
        break;
      case ETimeFilterType.CurrentQuarter:
        newFrom = today.startOf('quarter');
        newTo = today;
        break;
      case ETimeFilterType.CurrentYear:
        newFrom = today.startOf('year');
        newTo = today;
        break;
    }

    setFromDate(newFrom);
    setToDate(newTo);
    if (newFrom) {
      setReferenceDate(newFrom);
    }
    onChangeValue?.({
      startDate: newFrom ? newFrom.format('YYYY-MM-DDTHH:mm:ss') : null,
      endDate: newTo ? newTo.format('YYYY-MM-DDTHH:mm:ss') : null,
      timeFilterType: presetId,
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
      <StyledInputSelectDate
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
      </StyledInputSelectDate>

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
        <Row>
          {/* Left Sidebar - Presets */}
          <Column
            sx={{
              width: pxToRem(180),
              p: pxToRem(16),
              borderRight: `1px solid ${theme.palette.neutral[20]}`,
              gap: pxToRem(8),
            }}
          >
            {DATE_PRESETS.map((preset) => (
              <StyledPresetOption
                key={preset.id}
                onClick={() => handlePresetSelect(preset.id)}
                sx={{
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  variant='b3Regular'
                  sx={{
                    color:
                      selectedPreset === preset.id
                        ? theme.palette.blue[60]
                        : theme.palette.neutral[100],
                  }}
                >
                  {preset.label}
                </Typography>
                {selectedPreset === preset.id && (
                  <SvgColor
                    src={ASSET_CONSTANT.SVG.IconLinearCheck}
                    width={pxToRem(20)}
                    height={pxToRem(20)}
                    color='blue.60'
                  />
                )}
              </StyledPresetOption>
            ))}
          </Column>

          {/* Right Side - Calendar */}
          <StyledCalendarContainer id='input-select-date-calendar-side'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Column
                sx={{
                  p: pxToRem(12),
                }}
              >
                <DateCalendar
                  value={referenceDate}
                  onChange={(newValue) => {
                    if (newValue) {
                      setReferenceDate(dayjs(newValue));
                    }
                  }}
                  disableFuture
                  minDate={dayjs().subtract(365, 'day')}
                  disabled={selectedPreset !== 'custom'}
                  views={['year', 'month', 'day']}
                  openTo='day'
                  dayOfWeekFormatter={(day) => {
                    const dayNames = [
                      'Mon',
                      'Tues',
                      'Wed',
                      'Thur',
                      'Fri',
                      'Sat',
                      'Sun',
                    ];
                    const dayIndex = (dayjs(day).day() + 6) % 7;
                    return dayNames[dayIndex];
                  }}
                  slots={{
                    day: (dayProps) => {
                      const {
                        day,
                        outsideCurrentMonth,
                        onDaySelect,
                        ...other
                      } = dayProps;
                      const dayjsDay = dayjs(day);

                      const isStart =
                        fromDate && dayjsDay.isSame(fromDate, 'day');
                      const isEnd = toDate && dayjsDay.isSame(toDate, 'day');
                      const isSelected = isStart || isEnd;
                      const isClickDisabled =
                        selectedPreset !== 'custom' ||
                        other.disabled ||
                        dayjsDay.isAfter(dayjs(), 'day');
                      const isVisuallyDisabled =
                        other.disabled || dayjsDay.isAfter(dayjs(), 'day');

                      const isRangeFill =
                        (fromDate &&
                          toDate &&
                          dayjsDay.isAfter(fromDate, 'day') &&
                          dayjsDay.isBefore(toDate, 'day')) ||
                        (isStart && toDate) ||
                        (isEnd && fromDate);

                      const isFirstColumn = dayjsDay.day() === 1; // Monday
                      const isLastColumn = dayjsDay.day() === 0; // Sunday

                      const roundLeft = isStart || isFirstColumn;
                      const roundRight = isEnd || isLastColumn;

                      return (
                        <Box
                          sx={{
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: pxToRem(45),
                            height: pxToRem(40),
                            backgroundColor: isRangeFill
                              ? '#F7F4FF'
                              : 'transparent',
                            borderTopLeftRadius: roundLeft ? pxToRem(8) : 0,
                            borderBottomLeftRadius: roundLeft ? pxToRem(8) : 0,
                            borderTopRightRadius: roundRight ? pxToRem(8) : 0,
                            borderBottomRightRadius: roundRight
                              ? pxToRem(8)
                              : 0,
                          }}
                        >
                          <Box
                            component='button'
                            onClick={() => {
                              if (
                                selectedPreset === 'custom' &&
                                !other.disabled &&
                                !dayjsDay.isAfter(dayjs(), 'day')
                              ) {
                                onDaySelect?.(day);

                                // Handle date selection logic
                                const selectedDate = dayjsDay;
                                let newFrom = fromDate;
                                let newTo = toDate;

                                // If no fromDate or clicking after toDate, set as fromDate
                                if (
                                  !fromDate ||
                                  (toDate && selectedDate.isAfter(toDate))
                                ) {
                                  newFrom = selectedDate;
                                  newTo = null;
                                }
                                // If fromDate exists but no toDate, set as toDate
                                else if (fromDate && !toDate) {
                                  if (selectedDate.isBefore(fromDate)) {
                                    newTo = fromDate;
                                    newFrom = selectedDate;
                                  } else {
                                    newTo = selectedDate;
                                  }
                                }
                                // If both exist, reset and start new selection
                                else {
                                  newFrom = selectedDate;
                                  newTo = null;
                                }

                                setFromDate(newFrom);
                                setToDate(newTo);
                                setSelectedPreset(ETimeFilterType.Custom);

                                if (newFrom && newTo) {
                                  onChangeValue?.({
                                    startDate: newFrom.format(
                                      'YYYY-MM-DDTHH:mm:ss'
                                    ),
                                    endDate: newTo.format(
                                      'YYYY-MM-DDTHH:mm:ss'
                                    ),
                                    timeFilterType: ETimeFilterType.Custom,
                                  });
                                  handleClose();
                                }
                              }
                            }}
                            disabled={isClickDisabled}
                            sx={{
                              zIndex: 1,
                              width: pxToRem(32),
                              height: pxToRem(32),
                              fontSize: pxToRem(14),
                              background: isSelected
                                ? 'linear-gradient(180deg, #9333EA 0%, #7D16E0 100%)'
                                : 'transparent',
                              color: isSelected
                                ? `${theme.palette.neutral[0]} !important`
                                : theme.palette.neutral[100],
                              borderRadius: pxToRem(8),
                              border: 'none',
                              cursor: isClickDisabled ? 'default' : 'pointer',
                              opacity:
                                outsideCurrentMonth &&
                                !isSelected &&
                                !isRangeFill
                                  ? 0.3
                                  : isVisuallyDisabled && !isSelected
                                    ? 0.5
                                    : 1,
                              // '&:hover': {
                              //   background: isSelected
                              //     ? 'linear-gradient(180deg, #7D16E0 0%, #6B14C4 100%)'
                              //     : isDisabled
                              //       ? 'transparent'
                              //       : theme.palette.neutral[10],
                              // },
                            }}
                          >
                            {dayjsDay.date()}
                          </Box>
                        </Box>
                      );
                    },
                  }}
                  sx={{
                    width: pxToRem(316),
                    // height: pxToRem(380),
                    '& .MuiPickersCalendarHeader-root': {
                      paddingLeft: 0,
                      paddingRight: 0,
                      margin: 0,
                      color: 'red',
                    },
                    '& .MuiDayCalendar-slideTransition': {
                      height: pxToRem(254),
                    },
                    '& .MuiDayCalendar-header': {
                      justifyContent: 'space-between',
                      margin: `0 0 ${pxToRem(8)} 0`,
                    },
                    '& .MuiDayCalendar-weekDayLabel': {
                      width: pxToRem(45),
                      height: pxToRem(32),
                      fontSize: pxToRem(14),
                      color: theme.palette.neutral[60],
                      margin: 0,
                    },
                    '& .MuiDayCalendar-weekContainer': {
                      justifyContent: 'center',
                    },
                    '& .MuiPickersDay-root': {
                      fontSize: pxToRem(14),
                    },
                  }}
                />
              </Column>

              {/* Date Range Display */}
              <StyledDateRangeDisplay>
                <Row sx={{ gap: pxToRem(16) }}>
                  <Row
                    sx={{
                      gap: pxToRem(8),
                      alignItems: 'flex-end',
                      padding: `${pxToRem(1.5)} ${pxToRem(10)}`,
                    }}
                  >
                    <Typography variant='b4Medium' color='neutral.60'>
                      From
                    </Typography>
                    <Typography variant='t3Bold' color='neutral.80'>
                      {fromDate?.format('DD - MM - YYYY') || '-'}
                    </Typography>
                  </Row>
                  <Row
                    sx={{
                      gap: pxToRem(8),
                      alignItems: 'flex-end',
                      padding: `${pxToRem(1.5)} ${pxToRem(10)}`,
                    }}
                  >
                    <Typography variant='b4Medium' color='neutral.60'>
                      To
                    </Typography>
                    <Typography variant='t3Bold' color='neutral.80'>
                      {toDate?.format('DD - MM - YYYY') || '-'}
                    </Typography>
                  </Row>
                </Row>
              </StyledDateRangeDisplay>
            </LocalizationProvider>
          </StyledCalendarContainer>
        </Row>
      </Popover>
    </>
  );
}

export default React.memo(InputSelectDate);
