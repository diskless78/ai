import { useRef, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import { pxToRem } from 'src/theme/styles';

type BaseSwitchSize = 'small' | 'medium' | 'large';

type BaseSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: BaseSwitchSize;
  name?: string;
};

const sizeConfig = {
  small: {
    width: 36,
    height: 20,
    thumbSize: 16,
    padding: 2,
  },
  medium: {
    width: 40,
    height: 22,
    thumbSize: 18,
    padding: 2,
  },
  large: {
    width: 44,
    height: 24,
    thumbSize: 20,
    padding: 2,
  },
};

const BaseSwitch = ({
  checked,
  onChange,
  disabled = false,
  size = 'medium',
  name,
}: BaseSwitchProps) => {
  const theme = useTheme();
  const componentReady = useRef<boolean>(false);
  const config = sizeConfig[size];

  useEffect(() => {
    componentReady.current = true;
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const thumbTranslateX = checked
    ? config.width - config.thumbSize - config.padding * 2
    : 0;

  return (
    <Box
      onClick={handleToggle}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: pxToRem(config.width),
          height: pxToRem(config.height),
          backgroundColor: checked
            ? theme.palette.blue[60]
            : theme.palette.neutral[30],
          borderRadius: pxToRem(config.height / 2),
          padding: pxToRem(config.padding),
          transition: 'background-color 0.3s ease',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: pxToRem(config.thumbSize),
            height: pxToRem(config.thumbSize),
            backgroundColor: '#FFFFFF',
            borderRadius: '50%',
            top: pxToRem(config.padding),
            left: pxToRem(config.padding),
            transform: `translateX(${pxToRem(thumbTranslateX)})`,
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          },
          '&.ready::before': {
            transition: 'transform 0.3s ease',
          },
        }}
        className={`${componentReady.current ? 'ready' : 'idle'}`}
      >
        <input
          type='checkbox'
          checked={checked}
          onChange={() => onChange(!checked)}
          disabled={disabled}
          name={name}
          style={{
            opacity: 0,
            position: 'absolute',
            width: 0,
            height: 0,
          }}
        />
      </Box>
    </Box>
  );
};

export default BaseSwitch;
