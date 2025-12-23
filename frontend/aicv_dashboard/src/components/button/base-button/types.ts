export type BaseButtonSize = 'small' | 'medium' | 'large';
export type BaseButtonType = 'submit' | 'reset' | 'button';
export type BaseButtonColor = 'primary' | 'secondary' | 'white' | 'red';
export type BaseButtonVariant = 'contained' | 'outlined';
export type BaseButtonMode = 'dark' | 'light';

export type BaseButtonProps = {
  text: string;
  size: BaseButtonSize;
  type?: BaseButtonType;
  color?: BaseButtonColor;
  variant?: BaseButtonVariant;
  mode?: BaseButtonMode;
  fullWidth?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  width?: string | number;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
};
