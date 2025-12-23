import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from 'src/store';

export const selectAuthState = (state: RootState) => state.auth;

export const selectAuthLoading = createSelector(
  [selectAuthState],
  (auth) => auth.loading
);

export const selectAuthUser = createSelector(
  [selectAuthState],
  (auth) => auth.user
);

export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (auth) => auth.isAuthenticated
);

export const selectAuthError = createSelector(
  [selectAuthState],
  (auth) => auth.error
);
