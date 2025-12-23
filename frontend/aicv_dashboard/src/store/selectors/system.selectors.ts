// src/store/selectors/group.selectors.ts

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from 'src/store';

export const selectSystemState = (state: RootState) => state.system;

export const selectGroup = createSelector(
  [selectSystemState],
  (system) => system.groups
);
