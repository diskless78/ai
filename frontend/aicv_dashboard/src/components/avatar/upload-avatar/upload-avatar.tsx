import { Box, Avatar } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { useRef, useState } from 'react';

type Props = {
  size: number;
  src?: string;
  alt?: string;
  onFileChange?: (imageDataURL: string, imageFile: any) => void;
};

export default function UploadAvatar({ size, src, alt, onFileChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageData, setImageData] = useState(src);

  const handleAvatarClick = () => {
    if (onFileChange && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  function handleFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageDataURL = e.target.result;
        setImageData(imageDataURL);
        if (onFileChange) {
          onFileChange(imageDataURL, file);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <>
      <Avatar
        src={imageData ?? ''}
        alt={alt ?? 'avatar'}
        sx={{ width: pxToRem(size), height: pxToRem(size), cursor: 'pointer' }}
        onClick={handleAvatarClick}
      >
        {!imageData && (
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
        onChange={handleFileUpload}
      />
    </>
  );
}
