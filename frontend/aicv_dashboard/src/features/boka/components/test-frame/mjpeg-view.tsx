// MJPEGView.tsx
import React from 'react';

interface MJPEGViewProps {
  url?: string;
  width?: number | string;
  height?: number | string;
  alt?: string;
}

const MJPEGView: React.FC<MJPEGViewProps> = ({
  url = ``,
  width = 640,
  height = 480,
  alt = 'camera',
}) => {
  return (
    <img
      src={url}
      width={width}
      height={height}
      alt={alt}
      style={{
        display: 'block',
        objectFit: 'cover',
        background: '#000',
        borderRadius: 8,
      }}
      onError={(e) => {
        console.log('Stream error — reconnecting...');
        const img = e.currentTarget;
        setTimeout(() => {
          // reset src để reconnect
          img.src = img.src.split('?')[0] + '?t=' + Date.now();
        }, 1000);
      }}
    />
  );
};

export default MJPEGView;
