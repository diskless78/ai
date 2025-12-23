import React from 'react';
import type { Dayjs } from 'dayjs';
import { BaseCalendar } from '../shared/base-calendar';
import { CalendarDay } from '../shared/calendar-day';

interface SingleDateCalendarProps {
    value: Dayjs;
    onChange: (newValue: Dayjs) => void;
    selectedDate: Dayjs | null;
    onDateClick: (date: Dayjs) => void;
}

export const SingleDateCalendar: React.FC<SingleDateCalendarProps> = ({
    value,
    onChange,
    selectedDate,
    onDateClick,
}) => {
    return (
        <BaseCalendar
            value={value}
            onChange={onChange}
            slots={{
                day: (dayProps) => (
                    <CalendarDay
                        {...dayProps}
                        selectedDate={selectedDate}
                        onDateClick={onDateClick}
                    />
                ),
            }}
        />
    );
};
