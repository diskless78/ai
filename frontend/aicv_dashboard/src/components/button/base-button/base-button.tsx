import { Typography } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import Row from 'src/components/common/row';
import { themeSelector, useAppSelector } from 'src/store';
import { StyledBaseButton, StyledSpinner, StyledButtonContent } from './styles';
import type { BaseButtonProps } from './types';
import BaseIcon from 'src/components/svg/base-icon/base-icon';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';

export default function BaseButton({
  text,
  size,
  type = 'button',
  color = 'primary',
  variant = 'contained',
  mode,
  fullWidth,
  onClick,
  disabled,
  loading = false,
  width,
  iconLeft,
  iconRight,
}: BaseButtonProps) {
  const { mode: themeMode } = useAppSelector(themeSelector);
  const _mode = mode || themeMode;

  return (
    <StyledBaseButton
      ownerState={{
        variant,
        color,
        size,
        disabled: disabled,
        width,
        mode: _mode,
      }}
      size={size}
      type={type}
      variant={variant}
      fullWidth={fullWidth}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <StyledSpinner ownerState={{ color }}>
          <BaseIcon
            size={20}
            src={ASSET_CONSTANT.SVG.IconLinearSpin}
            color='#FFFFFF'
          />
        </StyledSpinner>
      )}

      <StyledButtonContent $isLoading={loading}>
        {iconLeft && (
          <Row alignItems='center' marginRight={pxToRem(6)}>
            {iconLeft}
          </Row>
        )}
        <Typography>{text}</Typography>
        {iconRight && (
          <Row alignItems='center' marginLeft={pxToRem(6)}>
            {iconRight}
          </Row>
        )}
      </StyledButtonContent>
    </StyledBaseButton>
  );
}
