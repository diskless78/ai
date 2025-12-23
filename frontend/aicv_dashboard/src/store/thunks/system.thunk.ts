import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  authTokens,
  userService,
  groupService,
  type ApiResponse,
} from 'src/services';
import { logoutAsync } from './auth.thunk';
import type { NavigateFunction } from 'react-router-dom';
import { setUser } from '../slices/auth.slice';
import { setGroups } from '../slices/system.slice';
import type { IGroupResponse } from 'src/models/group';
import { queryClient } from 'src/main';
import { CACHE_KEYS } from 'src/hooks/queries/use-common-service';

const fetchUserData = async () => {
  const token = await authTokens.getAccessToken();
  const resUser = await userService.getUserInfo();

  if (!token || !resUser.success) {
    throw new Error('User not authenticated');
  }

  return resUser.data.data;
};

const fetchGroupData = async () => {
  await queryClient.prefetchQuery({
    queryKey: [CACHE_KEYS.SystemGroupsList],
    queryFn: () => groupService.getList(),
    staleTime: 5 * 60 * 1000,
  });

  const cachedData = queryClient.getQueryData<ApiResponse<IGroupResponse>>([
    CACHE_KEYS.SystemGroupsList,
  ]);

  if (!cachedData?.success) {
    throw new Error('Failed to fetch group data');
  }

  return cachedData.data.data;
};

export const initSystemDataAsync = createAsyncThunk(
  'system/initData',
  async (
    params: { navigate?: NavigateFunction },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const userData = await fetchUserData();
      dispatch(setUser(userData));

      const [groupData] = await Promise.all([fetchGroupData()]);

      dispatch(setGroups(groupData));

      return true;
    } catch (err) {
      if (err instanceof Error && err.message === 'User not authenticated') {
        dispatch(logoutAsync({ navigate: params.navigate }));
        return rejectWithValue('User not authenticated');
      }

      const errorMessage = err instanceof Error ? err.message : 'Init failed';
      console.error('[initSystemDataAsync] Error:', errorMessage, err);
      return rejectWithValue(errorMessage);
    }
  }
);
