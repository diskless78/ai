import React from 'react';
import { Typography } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import { SvgColor } from 'src/components/svg/svg-color';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { StyledPresetOption } from './styles';
import type { DateRangePreset } from './types';
import { ETimeFilterType } from 'src/models/common/models.enum';

interface PresetListProps {
  presets: DateRangePreset[];
  selectedPreset: ETimeFilterType;
  onPresetSelect: (presetId: ETimeFilterType) => void;
  theme: any;
}

export const PresetList: React.FC<PresetListProps> = ({
  presets,
  selectedPreset,
  onPresetSelect,
  theme,
}) => {
  return (
    <>
      {presets.map((preset) => (
        <StyledPresetOption
          key={preset.id}
          onClick={() => onPresetSelect(preset.id)}
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
    </>
  );
};
