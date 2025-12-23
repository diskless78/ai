export type TagContainedTextColor =
  | 'warning'
  | 'success'
  | 'error'
  | 'info'
  | 'grey';
export type TagContainedBackgroundColor = 'inherit' | 'grey';

export type TagContainedProps = {
  label: string;
  textColor: TagContainedTextColor;
  backgroundColor: TagContainedBackgroundColor;
  alignSelf?: 'start' | 'center' | 'end';
  iconLeft?: React.ReactNode;
  hasBorder?: boolean;
};
