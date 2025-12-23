import {
  Box,
  MenuItem,
  useTheme,
  Typography,
  InputAdornment,
} from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import type { IValue } from 'src/models/common/models.type';
import type { InputMultiSelectProps } from './types';
import { StyledInputMultiSelect } from './styles';
import BaseCheckbox from 'src/components/check-box/check-box';
import Row from 'src/components/common/row';
import React, { useMemo, useCallback, useEffect, useRef } from 'react';
import { SvgColor } from 'src/components/svg/svg-color';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';

const IconCaretDown = React.memo((props: any) => (
  <InputAdornment position='end'>
    <SvgColor
      {...props}
      src={ASSET_CONSTANT.SVG.IconLinearArrowDown}
      width={pxToRem(24)}
      height={pxToRem(24)}
      color='neutral.100'
    />
  </InputAdornment>
));

export default function InputMultiSelect({
  name = '',
  value = [],
  onChangeValue,
  width = pxToRem(200),
  list,
  field,
  fullWidth,
  errors,
  showAllOption = false,
  allOptionLabel = 'All',
}: InputMultiSelectProps) {
  const theme = useTheme();
  const rawValue = field?.value ?? value;
  const isInitialized = useRef(false);

  const normalizedValue = useMemo(() => {
    if (!rawValue || rawValue.length === 0) return [];
    return rawValue.filter((id: string) => id !== 'all');
  }, [rawValue]);

  const isAllSelected = useMemo(() => {
    if (!showAllOption || !list || list.length === 0) return false;
    if (normalizedValue.length === 0) return false;
    return list.every((item) => normalizedValue.includes(item.id));
  }, [showAllOption, normalizedValue, list]);

  // Auto-select all items when list is loaded (if enabled)
  useEffect(() => {
    if (
      showAllOption &&
      list &&
      list.length > 0 &&
      !isInitialized.current &&
      normalizedValue.length === 0
    ) {
      const allIds = list.map((item) => item.id);
      field?.onChange(allIds);
      onChangeValue?.(allIds);
      isInitialized.current = true;
    }
  }, [list, showAllOption, normalizedValue.length, field, onChangeValue]);

  const handleChange = useCallback(
    (e: any) => {
      const selectedValue = e.target.value as string[];

      const clickedAll = selectedValue.includes('all');

      let newValue: string[];

      if (clickedAll) {
        if (isAllSelected) {
          newValue = [];
        } else {
          newValue = list.map((item) => item.id);
        }
      } else {
        newValue = selectedValue.filter((id) => id !== 'all');
      }

      field?.onChange(newValue);
      onChangeValue && onChangeValue(newValue);
    },
    [isAllSelected, list, field, onChangeValue]
  );

  const renderValue = useCallback(
    (selected: any) => {
      if (showAllOption && isAllSelected) {
        return (
          <Row alignItems='center' overflow='hidden' width='100%'>
            <Typography variant='b3Regular' textOverflow='ellipsis'>
              {allOptionLabel}
            </Typography>
          </Row>
        );
      }

      const selectedNames = list
        .filter((item: IValue) => selected.includes(item.id))
        .map((item: IValue) => item.name)
        .join(', ');

      return (
        <Row alignItems='center' overflow='hidden' width='100%'>
          <Typography variant='b3Regular' textOverflow='ellipsis'>
            {selectedNames}
          </Typography>
        </Row>
      );
    },
    [list, showAllOption, isAllSelected, allOptionLabel]
  );

  return (
    <StyledInputMultiSelect
      ownerState={{
        width,
        fullWidth,
        colorType:
          errors?.[name]?.message || normalizedValue.length === 0
            ? 'error'
            : 'normal',
      }}
      multiple
      MenuProps={{
        PaperProps: {
          sx: {
            backgroundColor: 'neutral.0',
            border: '1px solid',
            borderColor: 'neutral.20',
            boxShadow: theme.customShadows.card0,
          },
        },
        MenuListProps: {
          sx: {
            color: 'white',
            padding: `${pxToRem(8)} ${pxToRem(8)}`,
            gap: pxToRem(4),
            display: 'flex',
            flexDirection: 'column',

            '& .MuiMenuItem-root': {
              height: pxToRem(40),
              padding: `${pxToRem(9.5)} ${pxToRem(6)} ${pxToRem(9.5)} ${pxToRem(0)}`,
              borderRadius: pxToRem(6),
              '&.Mui-selected': {
                backgroundColor: 'transparent!important',
              },
              '& span': {
                opacity: 0.8,
                ...theme.typography.b3Regular,
                color: theme.palette.neutral[100],
              },

              '&.Mui-selected span': {
                opacity: 1,
              },
            },
          },
        },
      }}
      value={normalizedValue}
      onChange={handleChange}
      renderValue={renderValue}
      IconComponent={IconCaretDown}
    >
      {showAllOption && (
        <MenuItem key='all' value='all' disableRipple>
          <BaseCheckbox checked={isAllSelected} />
          <Box component='span' sx={{ ml: 1 }}>
            {allOptionLabel}
          </Box>
        </MenuItem>
      )}

      {list.map((option) => (
        <MenuItem key={option.id} value={option.id} disableRipple>
          <BaseCheckbox checked={normalizedValue.includes(option.id)} />
          <Box component='span' sx={{ ml: 1 }}>
            {option.name}
          </Box>
        </MenuItem>
      ))}
    </StyledInputMultiSelect>
  );
}
