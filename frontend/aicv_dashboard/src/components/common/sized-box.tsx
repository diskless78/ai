import { Box } from '@mui/material';
import { pxToRem } from 'src/theme/styles';

type SizedBoxProps = {
  height?:
    | number
    | { xs?: string; sm?: string; md?: string; lg?: string; xl?: string };
  width?:
    | number
    | { xs?: string; sm?: string; md?: string; lg?: string; xl?: string };
};

const SizedBox = ({ height = 0, width = 0 }: SizedBoxProps) => {
  const _height = handleSize(height);
  const _width = handleSize(width);

  return <Box width={_width} height={_height} />;
};

export default SizedBox;

function handleSize(size: any) {
  let result: any = {};
  if (typeof size === 'number') {
    result = {
      xs: pxToRem(size),
      sm: pxToRem(size),
      md: pxToRem(size),
      lg: pxToRem(size),
      xl: pxToRem(size),
    };
  } else if (typeof size === 'object') {
    result = size;
  } else {
    result = `100%`;
  }
  return result;
}
