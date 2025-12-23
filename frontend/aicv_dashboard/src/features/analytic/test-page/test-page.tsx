import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import DateRangePicker from 'src/components/input/date-range-picker/date-range-picker';
import type { DateRangeValue } from 'src/components/input/date-range-picker/types';
import InputDatePicker from 'src/components/input/input-date-picker/input-date-picker';

export default function TestPage() {
    const [dateValue, setDateValue] = useState<DateRangeValue | undefined>();
    const [singleDateValue, setSingleDateValue] = useState<string | undefined>();

    return (
        <Box
            sx={{
                p: pxToRem(24),
                display: 'flex',
                flexDirection: 'column',
                gap: pxToRem(24),
            }}
        >
            <Typography variant='h4'>Test Page</Typography>

            <Box>
                <Typography variant='b2Medium' sx={{ mb: pxToRem(12) }}>
                    Custom Width
                </Typography>
                <DateRangePicker width={pxToRem(400)} value={dateValue} onChangeValue={setDateValue} />
            </Box>

            <Box>
                <Typography variant='b2Medium' sx={{ mb: pxToRem(12) }}>
                    Input date picker
                </Typography>
                <InputDatePicker width={pxToRem(400)} value={singleDateValue} onChangeValue={setSingleDateValue} />
            </Box>
        </Box>
    );
}
