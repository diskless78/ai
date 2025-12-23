import { Box, Avatar } from '@mui/material';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { pxToRem } from 'src/theme/styles';

type Props = {
  size: number;
  src?: string;
  alt?: string;
};

export default function BaseAvatar({ size, src, alt }: Props) {
  return (
    <Avatar
      src={src ?? ''}
      alt={alt ?? 'avatar'}
      sx={{ width: pxToRem(size), height: pxToRem(size) }}
    >
      <Box
        component='img'
        src={ASSET_CONSTANT.IMAGE.AvatarEmpty}
        alt='avatar'
        sx={{ objectFit: 'cover' }}
        width={1}
        height={1}
      />
    </Avatar>
  );
}
