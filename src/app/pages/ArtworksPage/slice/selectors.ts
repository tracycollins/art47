import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectDomain = (state: RootState) => state.artworks || initialState;

export const selectArtworks = createSelector(
  [selectDomain],
  artworksState => artworksState.artworks,
);

export const selectArtworksDisplayIds = createSelector(
  [selectDomain],
  artworksState => artworksState.artworksDisplayIds,
);

export const selectCurrentArtwork = createSelector(
  [selectDomain],
  artworksState =>
    artworksState.artworks.find(
      artwork => artwork.id === artworksState.currentArtworkId,
    ),
);

export const selectCursor = createSelector(
  [selectDomain],
  artworksState => artworksState.cursor,
);

export const selectFilter = createSelector(
  [selectDomain],
  artworksState => artworksState.filter,
);

export const selectLoading = createSelector(
  [selectDomain],
  artworksState => artworksState.loading,
);

export const selectError = createSelector(
  [selectDomain],
  artworksState => artworksState.error,
);
