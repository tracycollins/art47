import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectDomain = (state: RootState) => state.user || initialState;

export const selectUser = createSelector(
  [selectDomain],
  userState => userState.user,
);

export const selectLoading = createSelector(
  [selectDomain],
  userState => userState.loading,
);

export const selectError = createSelector(
  [selectDomain],
  userState => userState.error,
);
