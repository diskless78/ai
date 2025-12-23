import React, { useMemo, useState, useEffect } from 'react';
import { Box, Modal } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import ImageEmpty from '../image-empty/image-empty';

interface BaseImageProps {
  src?: string;
  width?:
    | number
    | string
    | { xs?: string; sm?: string; md?: string; lg?: string; xl?: string };
  height?:
    | number
    | string
    | { xs?: string; sm?: string; md?: string; lg?: string; xl?: string };
  placeholder?: string;
  alt?: string;
  className?: string;
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  borderRadius?: number;
  style?: React.CSSProperties;
  onLoadComplete?: () => void;
  onLoadError?: () => void;
  enablePreview?: boolean;
  aspectRatio?: number | string;
  overlay?: React.ReactNode;
}

const handleSize = (size: any) => {
  if (typeof size === 'number') {
    const remSize = pxToRem(size);
    return { xs: remSize, sm: remSize, md: remSize, lg: remSize, xl: remSize };
  }
  if (typeof size === 'string') {
    return { xs: size, sm: size, md: size, lg: size, xl: size };
  }
  return size;
};

const BaseImage: React.FC<BaseImageProps> = ({
  src,
  width = '100%',
  height = '100%',
  alt = '',
  className = '',
  objectFit = 'cover',
  borderRadius = 0,
  style,
  onLoadComplete,
  onLoadError,
  enablePreview = true,
  aspectRatio,
  overlay,
}) => {
  const [open, setOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(src);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);

    if (src) {
      const img = new Image();
      img.src = src;

      if (img.complete) {
        setIsLoaded(true);
        onLoadComplete?.();
      } else {
        img.onload = () => {
          setIsLoaded(true);
          onLoadComplete?.();
        };
        img.onerror = () => {
          setHasError(true);
          onLoadError?.();
        };
      }
    }
  }, [onLoadComplete, onLoadError, src]);

  useEffect(() => {
    if (!open) {
      setPreviewSrc(src);
    }
  }, [src, open]);

  const _width = useMemo(() => handleSize(width), [width]);
  const _height = useMemo(() => handleSize(height), [height]);

  const handleOpen = () => {
    if (enablePreview && src && !hasError) {
      setPreviewSrc(src);
      setOpen(true);
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <Box
        className={className}
        sx={{
          width: _width,
          height: _height,
          position: 'relative',
          cursor: enablePreview && !hasError ? 'pointer' : 'default',
          overflow: 'hidden',
        }}
        onClick={hasError || !src ? undefined : handleOpen}
      >
        {!hasError && src && (
          <Box
            component='img'
            key={src}
            src={src}
            alt={alt}
            onError={() => {
              setHasError(true);
              setIsLoaded(false);
              onLoadError?.();
            }}
            className={className}
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease',
              width: '100%',
              height: '100%',
              aspectRatio,
              borderRadius: pxToRem(borderRadius),
              objectFit,
              backgroundColor: 'black',
              display: 'block',
              ...style,
            }}
          />
        )}

        {overlay && !hasError && isLoaded && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
            }}
          >
            {overlay}
          </Box>
        )}

        {(hasError || !src || !isLoaded) && (
          <ImageEmpty
            width={_width}
            height={_height}
            borderRadius={borderRadius}
          />
        )}
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.85)',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            maxWidth: '90%',
            maxHeight: '90%',
            outline: 'none',
          }}
        >
          <img
            src={previewSrc}
            alt={alt}
            style={{
              width: 'auto',
              maxWidth: '100%',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: pxToRem(borderRadius),
            }}
          />
          {/* 
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.5)',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
            }}
          >
            <CloseIcon />
          </IconButton> */}

          {overlay && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              {overlay}
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default BaseImage;
