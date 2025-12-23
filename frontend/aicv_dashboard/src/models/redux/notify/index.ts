export interface IReduxNotifyState {
  notifyModal: IReduxNotifyModal;
  notifySnackbar: IReduxNotifySnackbar;
}

export interface IReduxNotifyModal {
  open: boolean;
  content: string;
  title: string;
  type: 'delete' | 'confirm' | 'caution';
  textConfirm?: string;
  onConfirm?: () => void;
}

export interface IReduxNotifySnackbar {
  open: boolean;
  autoHideDuration: number;
  message: string;
  type: string;
}
