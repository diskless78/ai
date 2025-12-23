import React, { useState } from 'react';
import { Button, Box, useTheme } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import { useLanguage } from 'src/i18n/i18n';

export type ScanMode = 'auto' | 'manual';

interface ScanModeToggleProps {
  value?: ScanMode;
  onChange?: (mode: ScanMode) => void;
}

const ScanModeToggle: React.FC<ScanModeToggleProps> = ({
  value = 'auto',
  onChange,
}) => {
  const theme = useTheme();
  const lang = useLanguage();
  const [active, setActive] = useState<ScanMode>(value);

  const handleChange = (mode: ScanMode) => {
    setActive(mode);
    onChange?.(mode);
  };

  return (
    <Box display='flex' gap={pxToRem(8)}>
      <Button
        disableRipple
        variant='contained'
        onClick={() => handleChange('auto')}
        sx={{
          height: pxToRem(32),
          borderRadius: pxToRem(12),
          textTransform: 'none',
          px: pxToRem(16),
          py: pxToRem(6),
          ...theme.typography.t4SemiBold,
          backgroundColor:
            active === 'auto'
              ? theme.palette.blue[20]
              : theme.palette.neutral[10],
          color:
            active === 'auto'
              ? theme.palette.neutral[100]
              : theme.palette.neutral[60],
          boxShadow: 'none',
          '&:hover': {
            backgroundColor:
              active === 'auto'
                ? theme.palette.blue[20]
                : theme.palette.neutral[10],
            boxShadow: 'none',
          },
        }}
      >
        {lang('ColorCheck.AutomaticScan')}
      </Button>

      <Button
        disableRipple
        variant='contained'
        onClick={() => handleChange('manual')}
        sx={{
          borderRadius: pxToRem(12),
          textTransform: 'none',
          height: pxToRem(32),
          px: pxToRem(16),
          py: pxToRem(6),
          ...theme.typography.t4SemiBold,
          backgroundColor:
            active === 'manual'
              ? theme.palette.blue[20]
              : theme.palette.neutral[10],
          color:
            active === 'manual'
              ? theme.palette.neutral[100]
              : theme.palette.neutral[60],
          boxShadow: 'none',
          '&:hover': {
            backgroundColor:
              active === 'manual'
                ? theme.palette.blue[20]
                : theme.palette.neutral[10],
            boxShadow: 'none',
          },
        }}
      >
        {lang('ColorCheck.ManualCapture')}
      </Button>
    </Box>
  );
};

export default ScanModeToggle;
