import { Box } from '@mui/material';
import { forwardRef, useState, useImperativeHandle, useRef, memo } from 'react';
import { pxToRem } from 'src/theme/styles';
import FallbackView from './fallback-view';
import ScanEffect from './scan-effect';

export type CameraPreviewHandle = {
  updateSrc: (src: string) => void;
};

type Props = {
  alt?: string;
  className?: string;
  fit?: 'cover' | 'contain';
  showScanEffect?: boolean;
  onLoadError?: () => void;
  ratio?: number | 'auto';
  borderRadius?: number | string;
  placeholder?: string;
};

const CameraPreview = forwardRef<CameraPreviewHandle, Props>(
  (
    {
      alt = 'image',
      className = '',
      fit = 'cover',
      showScanEffect = false,
      onLoadError,
      ratio = 'auto',
      borderRadius = pxToRem(12),
      placeholder,
    },
    ref
  ) => {
    const [src, setSrc] = useState<string | null>(null);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useImperativeHandle(ref, () => ({
      updateSrc: (newSrc: string) => {
        setHasError(false);
        setSrc(newSrc || null);
      },
    }));

    const handleError = () => {
      setHasError(true);
      onLoadError?.();
    };

    const renderContent = () => {
      if (hasError || !src) {
        return <FallbackView placeholder={placeholder} />;
      }

      return (
        <>
          {showScanEffect && <ScanEffect />}
          <Box
            component='img'
            ref={imgRef}
            alt={alt}
            src={src}
            onError={handleError}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: fit,
              position: ratio === 'auto' ? 'relative' : 'absolute',
              inset: ratio === 'auto' ? 'unset' : 0,
            }}
          />
        </>
      );
    };

    return (
      <Box width='100%' height='100%' className={className}>
        <Box
          position='relative'
          width='100%'
          sx={{
            ...(ratio === 'auto'
              ? {
                  height: '100%',
                }
              : {
                  paddingTop: `${(1 / ratio) * 100}%`,
                }),
            borderRadius,
            overflow: 'hidden',
            backgroundColor: '#F4F5F7',
          }}
        >
          {renderContent()}
        </Box>
      </Box>
    );
  }
);

export default memo(CameraPreview);
