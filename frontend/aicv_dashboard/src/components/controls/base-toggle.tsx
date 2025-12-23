import { useRef, useState, useEffect, type RefObject } from 'react';
import { Box, InputLabel, Typography } from '@mui/material';
import { pxToRem } from 'src/theme/styles';

interface Segment {
  value: string;
  label: string;
  ref: RefObject<HTMLDivElement | null>;
}

type BaseToggleSize = 'small' | 'medium';

type BaseToggleProps = {
  name: string;
  segments: Segment[];
  callback: (value: string, index: number) => void;
  defaultIndex?: number;
  controlRef: RefObject<HTMLDivElement | null>;
  size?: BaseToggleSize;
};

const BaseToggle = ({
  name,
  segments,
  callback,
  defaultIndex = 0,
  controlRef,
}: BaseToggleProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const componentReady = useRef<boolean>(false);

  useEffect(() => {
    componentReady.current = true;
  }, []);

  const onInputChange = (value: any, index: any) => {
    setActiveIndex(index);
    callback(value, index);
  };

  return (
    <Box display='flex' ref={controlRef}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          backgroundColor: '#EFF3F8',
          borderRadius: pxToRem(40),
          height: pxToRem(32),
          px: pxToRem(2),
          py: pxToRem(2),
          border: '1px solid #00000005',
          position: 'relative',
          '& input': {
            opacity: 0,
            position: 'absolute',
          },
          '&:before': {
            content: '""',
            backgroundColor: 'neutral.0',
            borderRadius: '50%',
            width: pxToRem(26),
            transform: `translateX(${activeIndex === 0 ? pxToRem(2) : pxToRem(28)})`,
            position: 'absolute',
            height: pxToRem(26),
            top: pxToRem(2),
            bottom: pxToRem(2),
            left: 0,
            right: 0,
            zIndex: 0,
          },
          '&.ready::before': {
            transition: 'transform 0.3s ease, width 0.3s ease',
          },
        }}
        className={`controls ${componentReady.current ? 'ready' : 'idle'}`}
      >
        {segments?.map((item, i) => (
          <Box
            sx={{
              position: 'relative',
              width: pxToRem(26),
              height: pxToRem(26),
              zIndex: 1,
              display: 'flex',
              justifyContent: 'center',
            }}
            key={item.value}
            ref={item.ref}
          >
            <input
              type='radio'
              value={item.value}
              id={item.label}
              name={name}
              onChange={() => onInputChange(item.value, i)}
              checked={i === activeIndex}
            />
            <InputLabel
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'color 0.5s ease',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              htmlFor={item.label}
            >
              <Typography
                variant='t4SemiBold'
                color={i === activeIndex ? 'blue.80' : 'neutral.50'}
                sx={{ opacity: i === activeIndex ? 1 : 0.2 }}
              >
                {item.label}
              </Typography>
            </InputLabel>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default BaseToggle;
