import { combineReducers } from '@reduxjs/toolkit';
import authSlice from '../slices/auth.slice';
import appSlice from '../slices/app.slice';
import systemSlice from '../slices/system.slice';
import themeSlice from '../slices/theme.slice';
import notifySlice from '../slices/notify.slice';

const combinedReducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
  [appSlice.name]: appSlice.reducer,
  [systemSlice.name]: systemSlice.reducer,
  [themeSlice.name]: themeSlice.reducer,
  [notifySlice.name]: notifySlice.reducer,
});

export default combinedReducer;

