import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { pxToRem } from 'src/theme/styles';
import { SvgColor } from '../../svg/svg-color';
import { StyledInputSearch } from './styles';
import { InputAdornment } from '@mui/material';

type Props = {
  value?: string | null;
  fullWidth?: boolean;
  width?: string;
  placeholder?: string;
  onChangeValue?: (value: string) => void;
};

export default function InputSearch({
  value,
  fullWidth,
  width,
  placeholder,
  onChangeValue,
}: Props) {
  return (
    <StyledInputSearch
      ownerState={{ fullWidth, width }}
      placeholder={placeholder}
      variant='outlined'
      value={value}
      onChange={(event: any) => {
        onChangeValue && onChangeValue(event.target.value);
      }}
      sx={{ width }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position='start'>
              <SvgColor
                className='icon'
                src={ASSET_CONSTANT.SVG.IconLinearSearch}
                color='gray.700'
                width={pxToRem(20)}
                height={pxToRem(20)}
              />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
