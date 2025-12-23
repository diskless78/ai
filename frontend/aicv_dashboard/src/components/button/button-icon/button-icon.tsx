import type { BaseIconButtonProps } from './types';
import { StyledBaseIconButton } from './styles';

export default function BaseIconButton({
  size = 'medium',
  variant = 'contained',
  shape = 'circle',
  color,
  children,
  onClick,
}: BaseIconButtonProps) {
  return (
    <StyledBaseIconButton
      onClick={onClick}
      ownerState={{ size, variant, shape, color }}
    >
      {children}
    </StyledBaseIconButton>
  );
}
