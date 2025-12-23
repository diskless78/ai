import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IGroup } from 'src/models/group';
import type { IReduxSystemState } from 'src/models/redux/system';
import { initSystemDataAsync } from '../thunks/system.thunk';

export const initialState: IReduxSystemState = {
  groups: [],
  loading: false,
};

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    setGroups: (state, { payload }: PayloadAction<IGroup[]>) => {
      state.groups = payload?.map((item) => ({
        id: item.id,
        name: item.name,
      }));
    },
    resetSystem: (state) => {
      state.groups = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initSystemDataAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(initSystemDataAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(initSystemDataAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setGroups, resetSystem } = systemSlice.actions;
export default systemSlice;
