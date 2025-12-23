import { IconButton } from '@mui/material';
import { SvgColor } from 'src/components/svg/svg-color';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { themeSelector, useAppDispatch, useAppSelector } from 'src/store';
import { toggleTheme } from 'src/store/slices/theme.slice';
import { pxToRem } from 'src/theme/styles';
import type { ButtonThemeProps } from './types';

export default function ButtonTheme({ size = 'medium' }: ButtonThemeProps) {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector(themeSelector);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <IconButton
      sx={{
        width: pxToRem(size === 'small' ? 34 : 40),
        height: pxToRem(size === 'small' ? 34 : 40),
        borderRadius: pxToRem(10),
        backgroundColor: 'neutral.10',
        color: 'pink.500',
      }}
      onClick={handleToggleTheme}
    >
      <SvgColor
        src={
          mode === 'light'
            ? ASSET_CONSTANT.SVG.IconMoon
            : ASSET_CONSTANT.SVG.IconSun
        }
        width={pxToRem(size === 'small' ? 20 : 24)}
        height={pxToRem(size === 'small' ? 20 : 24)}
        color='blue.60'
      />
    </IconButton>
  );
}
