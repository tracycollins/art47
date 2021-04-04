import { PayloadAction, current } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { artistsSaga } from './saga';
import { ArtistsState, ArtistErrorType } from './types';

export const initialState: ArtistsState = {
  loading: false,
  error: null,
  artists: [],
  artistsDisplayIds: [],
  currentArtistId: null,
  cursor: { _id: 0, subDoc: 'none', sortType: 'none', sort: 'none' },
};

const slice = createSlice({
  name: 'artists',
  initialState,
  reducers: {
    setCursor(state, action) {
      state.cursor = action.payload.cursor;
    },
    setCurrentArtistId(state, action) {
      state.loading = false;
      state.currentArtistId = action.payload;
    },
    getArtistById(state, action) {
      state.currentArtistId = action.payload;
      state.loading = true;
      state.error = null;
    },
    getArtists(state) {
      console.log(`getArtists`);
      state.loading = true;
      state.error = null;
    },
    loadArtists(state) {
      state.loading = true;
      state.error = null;
    },
    artistsFilterSort(state) {
      const allArtists = [...current(state).artists]; // need to use RTK current to avoid proxy

      allArtists.sort((a, b) => {
        if (a._id < b._id) return -1;
        if (a._id > b._id) return 1;
        return 0;
      });
      state.artistsDisplayIds = allArtists.map(artist => artist.id);
    },
    artistsLoaded(state, action) {
      const artists = [...current(state).artists]; // need to use RTK current to avoid proxy
      const newArtists = [...action.payload.artists];
      let tempArtists = artists.filter(
        artist => !newArtists.find(newArtist => newArtist._id === artist._id),
      );
      tempArtists = [...tempArtists, ...newArtists];
      tempArtists.sort((a, b) => {
        if (a._id < b._id) return -1;
        if (a._id > b._id) return 1;
        return 0;
      });

      state.artists = tempArtists;

      if (action.payload.cursor) {
        const cursor = action.payload.cursor;
        state.cursor = cursor;
      }
      state.error = null;
      state.loading = false;
    },
    artistsError(state, action: PayloadAction<ArtistErrorType>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: artistsActions, reducer } = slice;

export const useArtistsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: artistsSaga });
  return { actions: slice.actions };
};
