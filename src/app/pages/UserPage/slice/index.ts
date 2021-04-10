import { PayloadAction } from '@reduxjs/toolkit';
import { User } from 'types/User';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { userSaga } from './saga';
import { UserState, UserErrorType } from './types';

export const initialState: UserState = {
  loaded: null,
  loading: false,
  error: null,
  user: {},
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authenticatedUser(state, action: PayloadAction<User>) {
      const user = action.payload;
      state.user = user;
      state.loading = false;
      state.loaded = 1;
    },
    setUser(state, action: PayloadAction<User>) {
      const user = Object.assign({}, action.payload);
      if (user && user.picture && user.image === null) {
        user.image = user.picture;
      }
      state.user = user;
      state.error = null;
      state.loading = false;
      state.loaded = null;
    },
    getUser(state, action) {
      state.error = null;
      state.loading = false;
      state.loaded = null;
    },
    updateUser(state, action) {
      state.error = null;
      state.loading = true;
      state.loaded = null;
    },
    loadUser(state, action) {
      state.error = null;
      state.user = {};
      state.loading = true;
      state.loaded = null;
    },
    userLoaded(state, action: PayloadAction<User>) {
      const user = action.payload;
      state.user = user;
      state.loading = false;
      state.loaded = 1;
    },
    userError(state, action: PayloadAction<UserErrorType>) {
      state.error = action.payload;
      state.loading = false;
      state.loaded = null;
    },
  },
});

export const { actions: userActions, reducer } = slice;

export const useUserSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: userSaga });
  return { actions: slice.actions };
};
