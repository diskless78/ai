import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import BaseIcon from 'src/components/svg/base-icon/base-icon';
import { StyledTooltipWrapper } from '../tooltip-content/tooltip-content';
import type { BaseTooltipProps } from './types';
import { StyledTooltipIconButton } from './styles';

export default function BaseTooltip({
  title,
  size = 'medium',
  ...props
}: BaseTooltipProps) {
  return (
    <StyledTooltipWrapper title={title} arrow placement='top' {...props}>
      <StyledTooltipIconButton ownerState={{ size }} disableRipple>
        <BaseIcon
          src={ASSET_CONSTANT.SVG.IconLinearCaution}
          size={size === 'small' ? 20 : 24}
          color='neutral.60'
        />
      </StyledTooltipIconButton>
    </StyledTooltipWrapper>
  );
}
