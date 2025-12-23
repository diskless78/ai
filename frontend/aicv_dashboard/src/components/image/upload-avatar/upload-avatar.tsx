import { Box, Avatar } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { useRef, useState } from 'react';

type Props = {
  size: number;
  src?: string;
  alt?: string;
  onFileChange?: (file: File) => void;
};

export default function UploadAvatar({ size, src, alt, onFileChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewSrc, setPreviewSrc] = useState<string | undefined>(src);

  const handleAvatarClick = () => {
    if (onFileChange && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewSrc(previewUrl);

      if (onFileChange) {
        onFileChange(file);
      }
    }
  };
  return (
    <>
      <Avatar
        src={previewSrc ?? ''}
        alt={alt ?? 'avatar'}
        sx={{ width: pxToRem(size), height: pxToRem(size), cursor: 'pointer' }}
        onClick={handleAvatarClick}
      >
        {!previewSrc && (
          <Box
            component='img'
            src={ASSET_CONSTANT.IMAGE.AvatarEmpty}
            alt='avatar'
            sx={{ objectFit: 'cover' }}
            width={1}
            height={1}
          />
        )}
      </Avatar>
      <input
        type='file'
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept='image/*'
        onChange={handleFileChange}
      />
    </>
  );
}
