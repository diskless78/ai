export interface BaseModalProps {
  title: string;
  open?: boolean;
  children?: React.ReactNode;
  width?: number;
  height?: number;
  onClose?: () => void;
}
