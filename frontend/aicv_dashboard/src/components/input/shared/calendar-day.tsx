import React from 'react';
import { Box, useTheme } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { pxToRem } from 'src/theme/styles';

interface CalendarDayProps {
    day: any;
    outsideCurrentMonth: boolean;
    onDaySelect?: (day: any) => void;
    disabled?: boolean;
    fromDate?: Dayjs | null;
    toDate?: Dayjs | null;
    selectedDate?: Dayjs | null;
    isCustomMode?: boolean;
    onDateClick: (date: Dayjs) => void;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
    day,
    outsideCurrentMonth,
    onDaySelect,
    disabled,
    fromDate,
    toDate,
    selectedDate,
    isCustomMode = true,
    onDateClick,
}) => {
    const theme = useTheme();
    const dayjsDay = dayjs(day);

    // Range mode (when fromDate/toDate are provided)
    const isStart = fromDate && dayjsDay.isSame(fromDate, 'day');
    const isEnd = toDate && dayjsDay.isSame(toDate, 'day');
    const isRangeFill =
        (fromDate && toDate && dayjsDay.isAfter(fromDate, 'day') && dayjsDay.isBefore(toDate, 'day')) ||
        (isStart && toDate) ||
        (isEnd && fromDate);

    // Single mode (when selectedDate is provided)
    const isSingleSelected = selectedDate && dayjsDay.isSame(selectedDate, 'day');

    const isSelected = isStart || isEnd || isSingleSelected;
    const isClickDisabled = !isCustomMode || disabled || dayjsDay.isAfter(dayjs(), 'day');
    const isVisuallyDisabled = disabled || dayjsDay.isAfter(dayjs(), 'day');

    // Range fill border radius logic
    const isFirstColumn = dayjsDay.day() === 1;
    const isLastColumn = dayjsDay.day() === 0;
    const roundLeft = isStart || isFirstColumn;
    const roundRight = isEnd || isLastColumn;

    const handleClick = () => {
        if (isCustomMode && !disabled && !dayjsDay.isAfter(dayjs(), 'day')) {
            onDaySelect?.(day);
            onDateClick(dayjsDay);
        }
    };

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: pxToRem(45),
                height: pxToRem(40),
                backgroundColor: isRangeFill ? '#F7F4FF' : 'transparent',
                borderTopLeftRadius: isRangeFill && roundLeft ? pxToRem(8) : 0,
                borderBottomLeftRadius: isRangeFill && roundLeft ? pxToRem(8) : 0,
                borderTopRightRadius: isRangeFill && roundRight ? pxToRem(8) : 0,
                borderBottomRightRadius: isRangeFill && roundRight ? pxToRem(8) : 0,
            }}
        >
            <Box
                component='button'
                onClick={handleClick}
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
                        outsideCurrentMonth && !isSelected && !isRangeFill
                            ? 0.3
                            : isVisuallyDisabled && !isSelected
                                ? 0.5
                                : 1,
                }}
            >
                {dayjsDay.date()}
            </Box>
        </Box>
    );
};
