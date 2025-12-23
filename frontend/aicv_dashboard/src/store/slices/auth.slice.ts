import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IReduxAuthState } from 'src/models/redux/auth';
import { loginAsync, logoutAsync } from '../thunks/auth.thunk';
import type { IUser } from 'src/models/user';

export interface AuthState extends IReduxAuthState {
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  token_type: null,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, { payload }: PayloadAction<string>) => {
      state.token = payload;
    },
    setUser(state, action: PayloadAction<IUser | null>) {
      state.user = action.payload
        ? {
            ...action.payload,
          }
        : null;
    },
    clearUser(state) {
      state.token = null;
      state.token_type = null;
      state.user = null;
    },
    resetAuth: () => initialState,
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAsync.fulfilled, () => {
        return { ...initialState };
      })
      .addCase(logoutAsync.rejected, () => {
        return { ...initialState };
      });
  },
});

export const { setToken, setUser, clearUser, clearError, resetAuth } =
  authSlice.actions;

export default authSlice;
