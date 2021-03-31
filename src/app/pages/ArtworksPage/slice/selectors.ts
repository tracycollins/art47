import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectDomain = (state: RootState) => state.artworks || initialState;

export const selectArtworks = createSelector(
  [selectDomain],
  artworksState => artworksState.artworks,
);

export const selectCursor = createSelector(
  [selectDomain],
  artworksState => artworksState.cursor,
);

export const selectLoading = createSelector(
  [selectDomain],
  artworksState => artworksState.loading,
);

export const selectError = createSelector(
  [selectDomain],
  artworksState => artworksState.error,
);
