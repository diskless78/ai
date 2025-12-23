import React from 'react';
import {
  motion,
  AnimatePresence,
  type Variants,
  cubicBezier,
} from 'framer-motion';
import { wrap } from '@popmotion/popcorn';
import { styled } from '@mui/material/styles';

export interface ImageItem {
  id: number;
  imageSrc: string;
}

interface SliderProps {
  images: ImageItem[];
  imageCount: number;
  direction: 1 | -1;
  onDragEnd?: (dragInfo: { offset: { x: number } }) => void;
}

/* --------------------------- Styled Components --------------------------- */

const SliderContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '100%',
  width: '100%',
}));

const SliderWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100%',
  width: '100%',
  overflow: 'hidden',
  [theme.breakpoints.down(375)]: {
    height: 400,
    width: 300,
  },
}));

const ImageBox = styled(motion.div)(() => ({
  position: 'absolute',
  height: '100%',
  width: '100%',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  willChange: 'transform, opacity',
}));

/* ------------------------------ Animations ------------------------------- */

const sliderVariants: Variants = {
  incoming: (direction: 1 | -1) => ({
    x: direction > 0 ? '100%' : '-100%',
    scale: 1.2,
    opacity: 0,
  }),
  active: { x: 0, scale: 1, opacity: 1 },
  exit: (direction: 1 | -1) => ({
    x: direction > 0 ? '-100%' : '100%',
    scale: 1,
    opacity: 0.2,
  }),
};

const sliderTransition = {
  duration: 1,
  ease: cubicBezier(0.56, 0.03, 0.12, 1.04),
};

/* -------------------------------- Component ------------------------------ */

export const Slider: React.FC<SliderProps> = ({
  images,
  imageCount,
  direction,
  // onDragEnd,
}) => {
  const activeImageIndex = wrap(0, images.length, imageCount);

  return (
    <SliderContainer>
      <SliderWrapper>
        <AnimatePresence initial={false} custom={direction}>
          <ImageBox
            key={imageCount}
            style={{
              backgroundImage: `url(${images[activeImageIndex].imageSrc})`,
            }}
            custom={direction}
            variants={sliderVariants}
            initial='incoming'
            animate='active'
            exit='exit'
            transition={sliderTransition}
            // Uncomment if you want dragging
            // drag='x'
            // dragConstraints={{ left: 0, right: 0 }}
            // dragElastic={1}
            // onDragEnd={(_, dragInfo) => onDragEnd?.(dragInfo)}
          />
        </AnimatePresence>
      </SliderWrapper>
    </SliderContainer>
  );
};
