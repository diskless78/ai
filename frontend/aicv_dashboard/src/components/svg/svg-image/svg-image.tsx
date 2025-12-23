import { Box } from '@mui/material';

type Props = {
  src: string;
  width?: number;
  height?: number;
  borderRadius?: number;
  opacity?: number;
};

export default function SvgImage({
  src,
  width,
  height,
  borderRadius,
  opacity,
}: Props) {
  return (
    <Box
      component='img'
      src={src}
      width={width}
      height={height}
      alt=''
      sx={{ borderRadius, opacity }}
    />
  );
}
