import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  DateRange,
  type RangeFocus,
  type RangeKeyDict,
} from 'react-date-range';
import dayjs from 'dayjs';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Box, TextField } from '@mui/material';
import { StyledModalDateRange, StyleInputDateRange } from './styles';
import { SvgColor } from 'src/components/svg/svg-color';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { inputDateRangeClasses } from './classes';
import Row from 'src/components/common/row';
import type { InputDateRangeProps } from './types';
import { stripTime } from 'src/utils/format-time';

type DateRangeType = {
  startDate: Date;
  endDate: Date;
  key: string;
};

const InputDateRange = ({ onChangeValue }: InputDateRangeProps) => {
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [alignRight, setAlignRight] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [rangeFocus, setRangeFocus] = useState<RangeFocus>([0, 0]);
  const lastEmittedRef = useRef<{ startDate: Date; endDate: Date } | null>(
    null
  );

  const today = stripTime(new Date());

  const [range, setRange] = useState<DateRangeType>({
    startDate: today,
    endDate: today,
    key: 'selection',
  });

  const handleSelect = (ranges: RangeKeyDict) => {
    const selectedRange = ranges.selection;
    const cleanStart = stripTime(selectedRange.startDate);
    const cleanEnd = stripTime(selectedRange.endDate);

    setRange({
      startDate: cleanStart,
      endDate: cleanEnd,
      key: 'selection',
    });

    if (rangeFocus[0] === 0 && rangeFocus[1] === 1 && cleanStart && cleanEnd) {
      const last = lastEmittedRef.current;
      const isNew =
        !last ||
        last.startDate.getTime() !== cleanStart.getTime() ||
        last.endDate.getTime() !== cleanEnd.getTime();

      if (isNew) {
        lastEmittedRef.current = { startDate: cleanStart, endDate: cleanEnd };
        onChangeValue?.({ startDate: cleanStart, endDate: cleanEnd });
      }
    }
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target as Node)
    ) {
      setShowPicker(false);
      setIsFocused(false);
    }
  };

  const togglePicker = useCallback(() => {
    if (showPicker) {
      setShowPicker(false);
      setIsFocused(false);
      return;
    }

    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const calendarWidth = 350;
      const spaceRight = window.innerWidth - rect.left;
      const shouldAlignRight = spaceRight < calendarWidth;
      setAlignRight(shouldAlignRight);
    }
    setIsFocused(true);
    setShowPicker(true);
  }, [showPicker, setShowPicker, wrapperRef]);

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (showPicker) togglePicker();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showPicker, togglePicker]);

  return (
    <Box>
      <StyleInputDateRange
        ref={wrapperRef}
        className={isFocused ? 'focused' : ''}
      >
        <Row className={inputDateRangeClasses.root}>
          <SvgColor
            src={ASSET_CONSTANT.SVG.IconLinearCalendar}
            onClick={togglePicker}
          />
          <TextField
            type='text'
            aria-readonly
            disabled
            value={dayjs(range.startDate).format('DD/MM/YYYY')}
            placeholder='Start Date'
          />
          <SvgColor src={ASSET_CONSTANT.SVG.IconArrowRight} />
          <TextField
            type='text'
            aria-readonly
            disabled
            value={dayjs(range.endDate).format('DD/MM/YYYY')}
            placeholder='End Date'
          />
        </Row>

        {showPicker && (
          <StyledModalDateRange ownerState={{ alignRight }}>
            <DateRange
              ranges={[range]}
              onChange={handleSelect}
              editableDateInputs={false}
              onRangeFocusChange={(newFocusedRange: RangeFocus) => {
                setRangeFocus(newFocusedRange);
                if (newFocusedRange[0] === 0 && newFocusedRange[1] === 0) {
                  setShowPicker(false);
                }
              }}
            />
          </StyledModalDateRange>
        )}
      </StyleInputDateRange>
    </Box>
  );
};

export default InputDateRange;
