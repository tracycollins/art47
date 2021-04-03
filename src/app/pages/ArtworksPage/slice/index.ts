import { PayloadAction, current } from '@reduxjs/toolkit';
// import { Artwork } from 'types/Artwork';
// import { Cursor } from 'types/Cursor';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { artworksSaga } from './saga';
import { ArtworksState, ArtworkErrorType } from './types';

export const initialState: ArtworksState = {
  loading: false,
  error: null,
  artworks: [],
  artworksDisplayIds: [],
  currentArtworkId: null,
  cursor: { _id: 0, subDoc: 'none', sortType: 'none', sort: 'none' },
  filter: { topRated: false, topRecs: false, unrated: false },
};

const slice = createSlice({
  name: 'artworks',
  initialState,
  reducers: {
    setCursor(state, action) {
      state.cursor = action.payload.cursor;
    },
    updateRating(state, action) {
      state.loading = true;
      state.error = null;
    },
    ratingLoaded(state, action) {
      const rating = action.payload.rating;
      console.log({ rating });
      state.loading = false;
    },
    updateFilterSort(state, action) {
      state.filter = action.payload.filter;
    },
    setCurrentArtworkId(state, action) {
      state.loading = false;
      state.currentArtworkId = action.payload;
    },
    getArtworkById(state, action) {
      state.currentArtworkId = action.payload;
      state.loading = true;
      state.error = null;
    },
    getArtworks(state) {
      state.loading = true;
      state.error = null;
    },
    loadArtworks(state) {
      state.loading = true;
      state.error = null;
    },
    artworksFilterSort(state) {
      const allArtworks = [...current(state).artworks]; // need to use RTK current to avoid proxy
      // const artworksDisplayIds = current(state).artworksDisplayIds;
      const filter = current(state).filter;
      console.log(filter);

      if (filter.topRated) {
        allArtworks.sort((a, b) => {
          const aRate = a.ratingUser ? a.ratingUser.rate : 0;
          const bRate = b.ratingUser ? b.ratingUser.rate : 0;
          if (aRate < bRate) return 1;
          if (aRate > bRate) return -1;
          return 0;
        });
        state.artworksDisplayIds = allArtworks.map(artwork => artwork.id);
        // state.artworks = [...allArtworks];
      } else if (filter.topRecs) {
        allArtworks.sort((a, b) => {
          const aScore = a.recommendationUser ? a.recommendationUser.score : 0;
          const bScore = b.recommendationUser ? b.recommendationUser.score : 0;
          if (aScore < bScore) return 1;
          if (aScore > bScore) return -1;
          return 0;
        });
        state.artworksDisplayIds = allArtworks.map(artwork => artwork.id);
        // state.artworks = [...allArtworks];
      } else if (filter.unrated) {
        const filteredArtworks = allArtworks.filter(artwork => {
          // console.log({ artwork });
          return artwork.ratingUser === undefined;
        });
        state.artworksDisplayIds = filteredArtworks.map(artwork => artwork.id);
        // state.artworks = [...tempArtworks];
      } else {
        allArtworks.sort((a, b) => {
          if (a._id < b._id) return -1;
          if (a._id > b._id) return 1;
          return 0;
        });
        state.artworksDisplayIds = allArtworks.map(artwork => artwork.id);
        // state.artworks = [...artworks];
      }
    },
    artworksLoaded(state, action) {
      // const user = action.payload.user;
      console.log({ action });
      const artworks = [...current(state).artworks]; // need to use RTK current to avoid proxy
      const newArtworks = [...action.payload.artworks];
      let tempArtworks = artworks.filter(
        artwork =>
          !newArtworks.find(newArtwork => newArtwork._id === artwork._id),
      );
      tempArtworks = [...tempArtworks, ...newArtworks];
      tempArtworks.sort((a, b) => {
        if (a._id < b._id) return -1;
        if (a._id > b._id) return 1;
        return 0;
      });

      state.artworks = tempArtworks;
      // }
      if (action.payload.cursor) {
        const cursor = action.payload.cursor;
        state.cursor = cursor;
      }
      state.error = null;
      state.loading = false;
    },
    artworksError(state, action: PayloadAction<ArtworkErrorType>) {
      state.error = action.payload;
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

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useArtworksSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
