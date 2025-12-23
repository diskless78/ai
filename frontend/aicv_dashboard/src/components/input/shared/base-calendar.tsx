import React from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import { useTheme } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import Column from 'src/components/common/column';

interface BaseCalendarProps {
    value: Dayjs;
    onChange: (newValue: Dayjs) => void;
    disabled?: boolean;
    slots: {
        day: React.ComponentType<any>;
    };
}

const dayOfWeekFormatter = (day: any) => {
    const dayNames = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
    const dayIndex = (dayjs(day).day() + 6) % 7;
    return dayNames[dayIndex];
};

export const BaseCalendar: React.FC<BaseCalendarProps> = ({
    value,
    onChange,
    disabled,
    slots,
}) => {
    const theme = useTheme();

    return (
        <Column>
            <DateCalendar
                value={value}
                onChange={(newValue) => {
                    if (newValue) onChange(dayjs(newValue));
                }}
                disableFuture
                minDate={dayjs().subtract(365, 'day')}
                disabled={disabled}
                views={['year', 'month', 'day']}
                openTo='day'
                dayOfWeekFormatter={dayOfWeekFormatter}
                slots={slots}
                sx={{
                    width: pxToRem(316),
                    '& .MuiPickersCalendarHeader-root': {
                        paddingLeft: 0,
                        paddingRight: 0,
                        margin: 0,
                        overflow: 'visible',
                    },
                    '& .MuiMonthCalendar-root': {
                        width: '100%',
                        maxHeight: pxToRem(254),
                        overflow: 'auto',
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
    );
};
