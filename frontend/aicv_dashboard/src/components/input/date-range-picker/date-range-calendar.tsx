import React from 'react';
import type { Dayjs } from 'dayjs';
import { BaseCalendar } from '../shared/base-calendar';
import { CalendarDay } from '../shared/calendar-day';

interface DateRangeCalendarProps {
    value: Dayjs;
    onChange: (newValue: Dayjs) => void;
    fromDate: Dayjs | null;
    toDate: Dayjs | null;
    isCustomMode: boolean;
    onDateClick: (date: Dayjs) => void;
    isStartCalendar?: boolean;
}

export const DateRangeCalendar: React.FC<DateRangeCalendarProps> = ({
    value,
    onChange,
    fromDate,
    toDate,
    isCustomMode,
    onDateClick,
    isStartCalendar = true,
}) => {
    const handleDateClick = (selectedDate: Dayjs) => {
        if (isStartCalendar) {
            onDateClick(selectedDate);
        } else {
            // For end calendar, only allow setting end date if start date exists
            if (fromDate) {
                onDateClick(selectedDate);
            }
        }
    };

    return (
        <BaseCalendar
            value={value}
            onChange={onChange}
            disabled={!isCustomMode}
            slots={{
                day: (dayProps) => (
                    <CalendarDay
                        {...dayProps}
                        fromDate={fromDate}
                        toDate={toDate}
                        isCustomMode={isCustomMode}
                        onDateClick={handleDateClick}
                    />
                ),
            }}
        />
    );
};
