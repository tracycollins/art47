import { PayloadAction, current } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { artworksSaga } from './saga';

import { ArtworksState, ArtworkErrorType } from './types';

export const initialState: ArtworksState = {
  loaded: false,
  loading: false,
  hasNextPage: false,
  error: null,
  artworks: [],
  artworksDisplayIds: [],
  currentArtworkId: null,
  cursor: {
    id: 0,
    subDoc: 'none',
    sort: 'none',
    value: 999,
    rate: 5,
    score: 100,
  },
  filter: { topRated: false, topRecs: false, unrated: false },
};

const slice = createSlice({
  name: 'artworks',
  initialState,
  reducers: {
    setCursor(state, action) {
      state.cursor = action.payload.cursor;
      // console.log({ action });
    },
    addArtwork(state, action) {
      state.loaded = false;
      state.loading = true;
      state.error = null;
    },
    uploadFile(state, action) {
      const uploadObj = action.payload;
      console.log({ uploadObj });
    },
    artworkAdded(state, action) {
      const artwork = action.payload.artwork;
      console.log({ artwork });
      state.loaded = true;
      state.loading = false;
    },
    updateRating(state, action) {
      state.loaded = false;
      state.loading = true;
      state.error = null;
    },
    ratingLoaded(state, action) {
      const rating = action.payload.rating;
      console.log({ rating });
      state.loaded = true;
      state.loading = false;
    },
    updateFilterSort(state, action) {
      state.filter = action.payload.filter;
    },
    setCurrentArtworkId(state, action) {
      state.currentArtworkId = action.payload;
    },
    getArtworkById(state, action) {
      state.currentArtworkId = action.payload;
      state.loaded = false;
      state.loading = true;
      state.error = null;
    },
    getArtworks(state) {
      state.loaded = false;
      state.loading = true;
      state.error = null;
    },
    startLoadArtworks(state) {
      state.loaded = false;
      state.loading = true;
      state.hasNextPage = false;
      state.error = null;
    },
    artworksFilterSort(state) {
      const allArtworks = [...current(state).artworks]; // need to use RTK current to avoid proxy
      const filter = current(state).filter;

      if (filter.topRated) {
        allArtworks.sort((a, b) => {
          const aRate = a.ratingUser ? a.ratingUser.rate : 0;
          const bRate = b.ratingUser ? b.ratingUser.rate : 0;
          if (aRate < bRate) return 1;
          if (aRate > bRate) return -1;
          if (a.id > b.id) return 1;
          if (a.id < b.id) return 11;
          return 0;
        });
        state.artworksDisplayIds = allArtworks
          .filter(artwork => artwork.ratingUser && artwork.ratingUser.rate > 0)
          .map(artwork => artwork.id);
      } else if (filter.topRecs) {
        allArtworks.sort((a, b) => {
          const aScore = a.recommendationUser ? a.recommendationUser.score : 0;
          const bScore = b.recommendationUser ? b.recommendationUser.score : 0;
          if (aScore < bScore) return 1;
          if (aScore > bScore) return -1;
          if (a.id > b.id) return 1;
          if (a.id < b.id) return -1;
          return 0;
        });
        state.artworksDisplayIds = allArtworks.map(artwork => artwork.id);
      } else if (filter.unrated) {
        const filteredArtworks = allArtworks.filter(artwork => {
          return artwork.ratingUser === undefined;
        });
        console.log(`unrated filteredArtworks ${filteredArtworks.length}`);
        filteredArtworks.sort((a, b) => {
          if (a.id > b.id) return 1;
          if (a.id < b.id) return -1;
          return 0;
        });
        state.artworksDisplayIds = filteredArtworks.map(artwork => artwork.id);
      } else {
        allArtworks.sort((a, b) => {
          if (a.id > b.id) return 1;
          if (a.id < b.id) return -1;
          return 0;
        });
        state.artworksDisplayIds = allArtworks.map(artwork => artwork.id);
      }
    },
    artworksLoaded(state, action) {
      const artworks = [...current(state).artworks]; // need to use RTK current to avoid proxy
      const newArtworks = [...action.payload.artworks];
      let tempArtworks = artworks.filter(
        artwork =>
          !newArtworks.find(newArtwork => newArtwork._id === artwork._id),
      );
      tempArtworks = [...tempArtworks, ...newArtworks];

      state.artworks = tempArtworks;

      if (action.payload.cursor) {
        const cursor = action.payload.cursor;
        state.cursor = cursor;
        state.hasNextPage = true;
      } else {
        state.hasNextPage = false;
      }
    },
    endLoadArtworks(state) {
      state.loaded = true;
      state.loading = false;
      state.error = null;
    },
    setHasNextPage(state, action) {
      state.hasNextPage = action.payload;
    },
    artworksError(state, action: PayloadAction<ArtworkErrorType>) {
      state.error = action.payload;
      state.hasNextPage = false;
      state.loaded = false;
      state.loading = false;
    },
  },
});

export const { actions: artworksActions, reducer } = slice;

export const useArtworksSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: artworksSaga });
  return { actions: slice.actions };
};
