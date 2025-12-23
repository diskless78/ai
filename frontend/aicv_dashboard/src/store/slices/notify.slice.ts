import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  IReduxNotifyModal,
  IReduxNotifyState,
  IReduxNotifySnackbar,
} from 'src/models/redux/notify';

export const initialState: IReduxNotifyState = {
  notifyModal: {
    open: false,
    content: '',
    title: '',
    type: 'error',
  },
  notifySnackbar: {
    open: false,
    autoHideDuration: 5000,
    message: '',
    type: 'error',
  },
};

const notifySlice = createSlice({
  name: 'notify',
  initialState,
  reducers: {
    setOpenNotifyModal: (
      state,
      { payload }: PayloadAction<IReduxNotifyModal>
    ) => {
      state.notifyModal = payload;
    },
    setCloseNotifyModal: (state) => {
      state.notifyModal.open = false;
    },
    setOpenNotifySnackbar: (
      state,
      { payload }: PayloadAction<IReduxNotifySnackbar>
    ) => {
      state.notifySnackbar = payload;
    },
    setCloseNotifySnackbar: (state) => {
      state.notifySnackbar.open = false;
    },
  },
});

export const {
  setOpenNotifyModal,
  setCloseNotifyModal,
  setOpenNotifySnackbar,
  setCloseNotifySnackbar,
} = notifySlice.actions;

export default notifySlice;
