import type { Theme, SxProps } from '@mui/material';
import { SvgColor } from '../svg-color';

type Props = {
  src: string;
  size: number;
  color?: string;
  opacity?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

export default function BaseIcon({
  src,
  size,
  color,
  opacity,
  sx,
  className,
}: Props) {
  return (
    <SvgColor
      src={src}
      width={size}
      height={size}
      color={color}
      opacity={opacity}
      sx={sx}
      className={className}
    />
  );
}
