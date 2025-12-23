import React, { useMemo, useCallback } from 'react';
import type { IValue } from 'src/models/common/models.type';
import { MenuItem, useTheme, Typography, InputAdornment } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import { SvgColor } from 'src/components/svg/svg-color';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import Row from 'src/components/common/row';
import { StyledInputSelect } from './styles';
import type { InputSelectProps } from './types';

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

const IconCheck = React.memo(() => (
  <SvgColor
    width={pxToRem(24)}
    height={pxToRem(24)}
    src={ASSET_CONSTANT.SVG.IconLinearCheck}
    color='blue.60'
  />
));

function InputSelect({
  name = '',
  value = '',
  onChangeValue,
  width = pxToRem(200),
  list,
  field,
  fullWidth,
  errors,
  placeholder,
  startIcon,
  sx,
  showAllOption = false,
  allOptionLabel = 'All',
}: InputSelectProps) {
  const theme = useTheme();
  const rawValue = field?.value ?? value;

  const listWithAll = useMemo(() => {
    if (!showAllOption) return list;
    return [{ id: 'all', name: allOptionLabel }, ...list];
  }, [showAllOption, allOptionLabel, list]);

  // Convert empty string to 'all' when showAllOption is enabled
  const normalizedValue = useMemo(() => {
    if (showAllOption && (rawValue === '' || rawValue === null)) {
      return 'all';
    }
    return rawValue;
  }, [showAllOption, rawValue]);

  const selectedValue = useMemo(() => {
    const valueExists = listWithAll.some((item) => item.id === normalizedValue);
    return valueExists ? normalizedValue : '';
  }, [normalizedValue, listWithAll]);

  const menuProps = useMemo(
    () => ({
      PaperProps: {
        sx: {
          display: listWithAll.length > 0 ? 'block' : 'none',
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
            padding: `${pxToRem(9.5)} ${pxToRem(6)} ${pxToRem(9.5)} ${pxToRem(10)}`,
            borderRadius: pxToRem(6),
            '&.Mui-selected': {
              backgroundColor: 'transparent!important',
            },
            '&:hover': {
              bgcolor: 'outline.default',
            },
          },
        },
      },
    }),
    [listWithAll.length, theme]
  );

  const renderValue = useCallback(
    (selected: any) => {
      const selectedItem = listWithAll.find((item) => item.id === selected);

      return (
        <Row alignItems='center' overflow='hidden' width='100%'>
          {startIcon}
          <Row alignItems='center' pl={pxToRem(6)}>
            {selectedItem ? (
              <Typography variant='b3Regular' textOverflow='ellipsis'>
                {selectedItem.name}
              </Typography>
            ) : (
              <Typography variant='b3Regular' color='text.disabled'>
                {placeholder || 'Choose your option'}
              </Typography>
            )}
          </Row>
        </Row>
      );
    },
    [listWithAll, placeholder, startIcon]
  );

  const menuItems = useMemo(
    () =>
      listWithAll.map((item: IValue) => (
        <MenuItem key={item.id} value={item.id}>
          <Row justifyContent='space-between' flex={1}>
            <Typography variant='b3Regular'>{item.name}</Typography>
            {selectedValue === item.id && <IconCheck />}
          </Row>
        </MenuItem>
      )),
    [listWithAll, selectedValue]
  );

  return (
    <StyledInputSelect
      name={name}
      sx={sx}
      ownerState={{
        width,
        fullWidth,
        colorType: errors?.[name]?.message ? 'error' : 'normal',
      }}
      variant='outlined'
      value={selectedValue}
      onChange={(e) => {
        const newValue = e.target.value as string;
        // Convert 'all' back to empty string when showAllOption is enabled
        const outputValue = showAllOption && newValue === 'all' ? '' : newValue;

        field?.onChange(outputValue);
        onChangeValue && onChangeValue(outputValue);
      }}
      displayEmpty
      renderValue={renderValue}
      IconComponent={IconCaretDown}
      MenuProps={menuProps}
    >
      {menuItems}
    </StyledInputSelect>
  );
}

export default React.memo(InputSelect);
