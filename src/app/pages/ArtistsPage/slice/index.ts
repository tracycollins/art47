import { PayloadAction, current } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { artistsSaga } from './saga';
import { ArtistsState, ArtistErrorType } from './types';

export const initialState: ArtistsState = {
  loaded: false,
  loading: false,
  hasNextPage: false,
  error: null,
  artists: [],
  artistsDisplayIds: [],
  currentArtistId: null,
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
      // console.log(`getArtists`);
      state.loading = true;
      state.error = null;
    },
    startLoadArtists(state) {
      state.loaded = false;
      state.loading = true;
      state.hasNextPage = false;
      state.error = null;
    },
    artistsFilterSort(state) {
      const allArtists = [...current(state).artists]; // need to use RTK current to avoid proxy

      allArtists.sort((a, b) => {
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
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
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
        return 0;
      });

      state.artists = tempArtists;

      if (action.payload.cursor) {
        const cursor = action.payload.cursor;
        state.cursor = cursor;
        state.hasNextPage = true;
      } else {
        state.hasNextPage = false;
      }
    },
    endLoadArtists(state) {
      state.loaded = true;
      state.loading = false;
      state.error = null;
    },
    setHasNextPage(state, action) {
      state.hasNextPage = action.payload;
    },
    artistsError(state, action: PayloadAction<ArtistErrorType>) {
      state.error = action.payload;
      state.hasNextPage = false;
      state.loaded = false;
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
