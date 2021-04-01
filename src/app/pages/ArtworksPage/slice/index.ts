import { PayloadAction } from '@reduxjs/toolkit';
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
  currentArtworkId: null,
  cursor: { _id: 0, subDoc: 'none', sortType: 'none', sort: 'none' },
};

const slice = createSlice({
  name: 'artworks',
  initialState,
  reducers: {
    updateRating(state, action) {
      state.loading = true;
      state.error = null;
    },
    ratingLoaded(state, action) {
      const rating = action.payload.rating;
      console.log({ rating });
      state.loading = false;
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
    artworksLoaded(state, action) {
      const artworks = [...state.artworks];
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
