import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectDomain = (state: RootState) => state.artists || initialState;

export const selectArtists = createSelector(
  [selectDomain],
  artistsState => artistsState.artists,
);

export const selectArtistsDisplayIds = createSelector(
  [selectDomain],
  artistsState => artistsState.artistsDisplayIds,
);

export const selectCurrentArtist = createSelector(
  [selectDomain],
  artistsState =>
    artistsState.artists.find(
      artist => artist.id === artistsState.currentArtistId,
    ),
);

export const selectCursor = createSelector(
  [selectDomain],
  artistsState => artistsState.cursor,
);

export const selectLoading = createSelector(
  [selectDomain],
  artistsState => artistsState.loading,
);

export const selectLoaded = createSelector(
  [selectDomain],
  artistsState => artistsState.loaded,
);

export const selectError = createSelector(
  [selectDomain],
  artistsState => artistsState.error,
);
