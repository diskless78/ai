import { useRef, useState, useEffect } from 'react';
import { Box, useTheme, InputLabel, Typography } from '@mui/material';
import type { SegmentedControlProps } from './types';
import { StyledSegmentedControl } from './styles';

const SegmentedControl = ({
  name,
  segments,
  onChange,
  defaultIndex = 0,
  controlRef,
  size = 'medium',
  segmentedWidth,
}: SegmentedControlProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const componentReady = useRef<boolean>(false);
  const theme = useTheme();

  useEffect(() => {
    componentReady.current = true;
  }, []);

  useEffect(() => {
    const activeSegmentRef = segments[activeIndex].ref;

    controlRef.current?.style.setProperty(
      '--highlight-width',
      `${activeSegmentRef.current?.offsetWidth ?? '0'}px`
    );
    controlRef.current?.style.setProperty(
      '--highlight-x-pos',
      `${activeSegmentRef.current?.offsetLeft ?? '0'}px`
    );
  }, [activeIndex, onChange, controlRef, segments]);

  const onInputChange = (value: any, index: any) => {
    setActiveIndex(index);
    onChange(value, index);
  };

  const textVariant = size === 'small' ? 'body2' : 't2SemiBold';

  return (
    <StyledSegmentedControl
      ref={controlRef}
      ownerState={{
        size,
        segmentedWidth,
      }}
      theme={theme}
      className={`controls ${componentReady.current ? 'ready' : 'idle'}`}
    >
      {segments?.map((item, i) => (
        <Box className='segment' key={item.value} ref={item.ref}>
          <input
            type='radio'
            value={item.value}
            id={`${name}-${i}`}
            name={name}
            onChange={() => onInputChange(item.value, i)}
            checked={i === activeIndex}
          />
          <InputLabel
            sx={{
              color: i === activeIndex ? 'white' : 'rgba(255, 255, 255, 0.3)',
            }}
            htmlFor={`${name}-${i}`}
          >
            <Typography
              variant={textVariant}
              color={i === activeIndex ? 'text.heading' : 'text.body'}
              sx={{ opacity: i === activeIndex ? 1 : 0.5 }}
            >
              {item.label}
            </Typography>
          </InputLabel>
        </Box>
      ))}
    </StyledSegmentedControl>
  );
};

export default SegmentedControl;
