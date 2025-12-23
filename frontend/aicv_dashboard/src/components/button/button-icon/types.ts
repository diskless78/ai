export type BaseIconButtonSize = 'small' | 'medium';
export type BaseIconButtonVariant = 'contained';
export type BaseIconButtonShape = 'circle' | 'square';
export type BaseIconButtonColor = 'red' | 'grey';

export type BaseIconButtonProps = {
  size?: BaseIconButtonSize;
  variant?: BaseIconButtonVariant;
  shape?: BaseIconButtonShape;
  color?: BaseIconButtonColor;
  children: React.ReactNode;
  onClick?: () => void;
};
