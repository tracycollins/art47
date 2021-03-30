import { PayloadAction } from '@reduxjs/toolkit';
import { Artwork } from 'types/Artwork';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { artworksSaga } from './saga';
import { ArtworksState, ArtworkErrorType } from './types';

export const initialState: ArtworksState = {
  loading: false,
  error: null,
  artworks: [],
};

const slice = createSlice({
  name: 'artworks',
  initialState,
  reducers: {
    getArtworks(state) {
      state.loading = true;
      state.error = null;
      state.artworks = [];
    },
    loadArtworks(state) {
      state.loading = true;
      state.error = null;
      state.artworks = [];
    },
    artworksLoaded(state, action: PayloadAction<Artwork[]>) {
      const artworks = action.payload;
      state.artworks = artworks;
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
