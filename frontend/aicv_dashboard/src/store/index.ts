// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from 'react-redux';
import persistConfig from './persistConfig';
import rootReducer from './reducers';
import { rootSaga } from './sagas';

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Infer RootState from rootReducer and type persist reducer
export type RootState = ReturnType<typeof rootReducer>;

// Create persisted reducer
const persistedReducer = persistReducer<RootState>(
  persistConfig,
  rootReducer as any
);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Run sagas
sagaMiddleware.run(rootSaga);

// Create persistor
const persistor = persistStore(store);

// Export store and persistor
export const reduxStore = {
  store,
  persistor,
} as const;

// Export types
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Memoized Selectors
export const authSelector = (state: RootState) => state.auth;
export const systemSelector = (state: RootState) => state.system;
export const notifySelector = (state: RootState) => state.notify;
export const themeSelector = (state: RootState) => state.theme;
