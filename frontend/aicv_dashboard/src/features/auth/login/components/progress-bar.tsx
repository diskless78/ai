import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

interface ProgressBarProps {
  segments?: number;
  duration?: number;
  gap?: number;
  onComplete?: () => void;
  onChangeIndex?: (index: number) => void;
  loop?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  segments = 1,
  duration = 4000,
  gap = 8,
  onComplete,
  onChangeIndex,
  loop = false,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextIndex = activeIndex + 1;

      if (nextIndex < segments) {
        setActiveIndex(nextIndex);
        onChangeIndex?.(nextIndex);
      } else {
        onComplete?.();
        if (loop) {
          setActiveIndex(0);
          onChangeIndex?.(0);
        }
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [activeIndex, segments, duration, loop, onChangeIndex, onComplete]);

  return (
    <Box
      className='progress-bar'
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: `${gap}px`,
        width: '340px',
        padding: '10px 20px',
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 5,
      }}
    >
      {Array.from({ length: segments }).map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'relative',
            flex: 1,
            height: '4px',
            borderRadius: '2px',
            backgroundColor: 'rgba(255,255,255,0.3)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: i < activeIndex ? '100%' : i === activeIndex ? '0%' : '0%',
              backgroundColor: '#fff',
              animation:
                i === activeIndex
                  ? `fill ${duration}ms linear forwards`
                  : 'none',
              '@keyframes fill': {
                from: { width: '0%' },
                to: { width: '100%' },
              },
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default ProgressBar;
