import { IconButton, useTheme } from '@mui/material';
import { Logo } from 'src/components/logo';
import Row from 'src/components/common/row';
import SvgImage from 'src/components/svg/svg-image/svg-image';
import { SvgColor } from 'src/components/svg/svg-color';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { pxToRem } from 'src/theme/styles';

type NavHeaderProps = {
  isCollapsed: boolean;
  onCollapse: () => void;
};

export function NavHeader({ isCollapsed, onCollapse }: NavHeaderProps) {
  const theme = useTheme();

  return (
    <Row justifyContent='space-between' alignItems='center'>
      {!isCollapsed ? (
        <Logo width={128} height={32} paddingLeft={pxToRem(1)} />
      ) : (
        <Row
          sx={{
            cursor: 'pointer',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={onCollapse}
        >
          <SvgImage
            width={40}
            height={33}
            src={ASSET_CONSTANT.SVG.LogoSingle}
          />
        </Row>
      )}
      {!isCollapsed && (
        <IconButton onClick={onCollapse} size='small' sx={{ ml: 1 }}>
          <SvgColor
            width={24}
            height={24}
            src={ASSET_CONSTANT.SVG.IconLinearExtend}
            color={theme.palette.neutral[60]}
          />
        </IconButton>
      )}
    </Row>
  );
}
