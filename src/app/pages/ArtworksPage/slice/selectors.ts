import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';
import { initialState as initialUserState } from 'app/pages/UserPage/slice';

const selectDomain = (state: RootState) => state.artworks || initialState;
const selectUserDomain = (state: RootState) => state.user || initialUserState;

export const selectArtworks = createSelector(
  [selectDomain],
  artworksState => artworksState.artworks,
);

export const selectArtworksDisplayIds = createSelector(
  [selectDomain],
  artworksState => artworksState.artworksDisplayIds,
);

// export const selectTopUnratedArtwork = createSelector(
//   [selectDomain],
//   artworksState =>
//     artworksState.artworks.filter(
//       artwork => artwork.id !== artworksState.currentArtworkId,
//     ),
// );

export const selectTopUnratedArtwork = createSelector(
  [selectDomain, selectUserDomain],
  (artworksState, userState) => {
    if (!userState) {
      return artworksState.artworks;
    }
    console.log({ userState });
    const unratedArtworks = artworksState.artworks.filter(
      // artwork => !artwork.ratingUser || artwork.ratingUser === undefined,
      artwork => userState.user.unrated.includes(artwork._id),
    );
    unratedArtworks.sort((a, b) => {
      if (a.recommendationUser && b.recommendationUser) {
        if (a.recommendationUser.score < b.recommendationUser.score) return 1;
        if (a.recommendationUser.score > b.recommendationUser.score) return -1;
      }
      if (a.id > b.id) return 1;
      if (a.id < b.id) return -1;
      return 0;
    });
    return unratedArtworks.slice(0, 9);
  },
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

export const selectLoaded = createSelector(
  [selectDomain],
  artworksState => artworksState.loaded,
);

export const selectHasNextPage = createSelector(
  [selectDomain],
  artworksState => artworksState.hasNextPage,
);

export const selectError = createSelector(
  [selectDomain],
  artworksState => artworksState.error,
);
