import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectDomain = (state: RootState) => state.stats || initialState;

export const selectStats = createSelector(
  [selectDomain],
  statsState => statsState.stats,
);

export const selectLoading = createSelector(
  [selectDomain],
  statsState => statsState.loading,
);

export const selectLoaded = createSelector(
  [selectDomain],
  statsState => statsState.loaded,
);

export const selectError = createSelector(
  [selectDomain],
  statsState => statsState.error,
);
