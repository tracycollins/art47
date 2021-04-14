import { PayloadAction } from '@reduxjs/toolkit';
import { Stats } from 'types/Stats';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { statsSaga } from './saga';
import { StatsState, StatsErrorType } from './types';

export const initialState: StatsState = {
  stats: {
    artists: {
      total: 0,
    },
    artworks: {
      total: 0,
    },
    users: {
      total: 0,
    },
    ratings: {
      total: 0,
    },
    user: {
      rated: 0,
      unrated: 0,
    },
  },
  loaded: null,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    setStats(state, action: PayloadAction<Stats>) {
      const newStats = Object.assign({}, action.payload);
      state.stats = newStats;
      state.error = null;
      state.loading = false;
      state.loaded = null;
    },
    getStats(state, action) {
      state.error = null;
      state.loading = true;
      state.loaded = null;
    },
    updateStats(state, action) {
      state.error = null;
      state.loading = true;
      state.loaded = null;
    },
    loadStats(state, action) {
      state.error = null;
      state.stats = {};
      state.loading = true;
      state.loaded = null;
    },
    statsLoaded(state, action: PayloadAction<Stats>) {
      const stats = action.payload;
      state.stats = stats;
      state.loading = false;
      state.loaded = 1;
    },
    statsError(state, action: PayloadAction<StatsErrorType>) {
      state.error = action.payload;
      state.loading = false;
      state.loaded = null;
    },
  },
});

export const { actions: statsActions, reducer } = slice;

export const useStatsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: statsSaga });
  return { actions: slice.actions };
};
