// src/store/auth/auth.thunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { NavigateFunction } from 'react-router-dom';
import type { ILoginRequest } from 'src/models/auth';
import type { GetUserInfoResponse } from 'src/models/user';
import {
  authService,
  userService,
  authTokens,
  type ApiResponse,
} from 'src/services';
import { ROUTES_CONSTANT } from 'src/constants/routes.constant';
import { toggleMessage } from 'src/components/toast/toast/toast';
import { resetSystem } from '../slices/system.slice';
import { queryClient } from 'src/main';

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (
    params: { request: ILoginRequest; navigate?: NavigateFunction },
    { rejectWithValue }
  ) => {
    try {
      const resUserLogin = await authService.login(params.request);

      if (!resUserLogin.success) {
        const message = resUserLogin.message
          ? `Error.${resUserLogin.message}`
          : 'Login failed';
        toggleMessage({
          title: 'Login failed',
          type: 'error',
          message,
          translate: true,
        });
        return rejectWithValue(message);
      }

      // Store token
      await authTokens.storeToken(resUserLogin.data.token);

      // Fetch user info
      const resUserInfo: ApiResponse<GetUserInfoResponse> =
        await userService.getUserInfo();

      if (!resUserInfo.success) {
        await authTokens.clear();
        return rejectWithValue(
          resUserInfo.message || 'Failed to fetch user info'
        );
      }

      if (params?.navigate) {
        params.navigate(ROUTES_CONSTANT.HOME, { replace: true });
      }

      return {
        token: resUserLogin.data.token,
        user: resUserInfo.data.data,
      };
    } catch (error) {
      await authTokens.clear();
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (
    params: { navigate?: NavigateFunction },
    { dispatch, rejectWithValue }
  ) => {
    try {
      // Clear authentication tokens
      await authTokens.clear();

      // Reset Redux system state
      dispatch(resetSystem());

      // Clear all React Query cache
      queryClient.clear();

      if (params?.navigate) {
        params.navigate(ROUTES_CONSTANT.LOGIN, { replace: true });
      }

      return null;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Logout failed'
      );
    }
  }
);
