// SliderLogin.tsx
import { useState, useCallback } from 'react';
import { Slider, type ImageItem } from './slider';
import { Box } from '@mui/material';
import SliderDescription from './slider-description';
import SliderLogo from './slider-logo';
import ProgressBar from '../progress-bar';

export const SliderLogin: React.FC = () => {
  const IMAGES: ImageItem[] = [
    { id: 0, imageSrc: 'assets/images/slider/slider-1.jpg' },
    { id: 1, imageSrc: 'assets/images/slider/slider-2.jpg' },
    { id: 2, imageSrc: 'assets/images/slider/slider-3.jpg' },
    { id: 3, imageSrc: 'assets/images/slider/slider-4.jpg' },
  ];

  const [[imageCount, direction], setImageCount] = useState<[number, 1 | -1]>([
    0, 1,
  ]);

  const swipeToImage = useCallback((swipeDirection: 1 | -1) => {
    setImageCount(([count]) => [count + swipeDirection, swipeDirection]);
  }, []);

  const dragEndHandler = (dragInfo: { offset: { x: number } }) => {
    const draggedDistance = dragInfo.offset.x;
    const swipeThreshold = 50;
    if (draggedDistance > swipeThreshold) swipeToImage(-1);
    else if (draggedDistance < -swipeThreshold) swipeToImage(1);
  };

  const handleAutoNext = () => {
    swipeToImage(1);
  };

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        position: 'relative',
      }}
    >
      <SliderLogo />
      <Slider
        images={IMAGES}
        imageCount={imageCount}
        direction={direction}
        onDragEnd={dragEndHandler}
      />
      <SliderDescription />
      <ProgressBar
        segments={IMAGES.length}
        duration={4000}
        onChangeIndex={handleAutoNext}
        loop
      />
    </Box>
  );
};
