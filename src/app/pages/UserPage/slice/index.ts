import { PayloadAction } from '@reduxjs/toolkit';
import { User } from 'types/User';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { userSaga } from './saga';
import { UserState, UserErrorType } from './types';

export const initialState: UserState = {
  loading: false,
  error: null,
  user: {},
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      const user = action.payload;
      state.user = user;
      state.error = null;
      state.loading = false;
    },
    getUser(state, action) {
      state.error = null;
      state.loading = false;
    },
    loadUser(state, action) {
      state.loading = true;
      state.error = null;
      state.user = {};
    },
    userLoaded(state, action: PayloadAction<User>) {
      const user = action.payload;
      state.user = user;
      state.loading = false;
    },
    userError(state, action: PayloadAction<UserErrorType>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: userActions, reducer } = slice;

export const useUserSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: userSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useUserSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */

// import { PayloadAction } from '@reduxjs/toolkit';
// import { createSlice } from 'utils/@reduxjs/toolkit';
// import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
// import { userSaga } from './saga';
// import { UserState, UserErrorType } from './types';
// import { User } from 'types/User';

// export const initialState: UserState = {
//   loading: false,
//   error: null,
//   user: {},
// };

// const slice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     setUser(state, action: PayloadAction<any>) {
//       console.log({ action });
//       state.user = action.payload.user;
//       // state = action.payload.user;
//     },
//     loadUser(state) {
//       state.loading = true;
//       state.error = null;
//       state.user = {};
//     },
//     userLoaded(state, action: PayloadAction<User>) {
//       const user = action.payload;
//       state.user = user;
//       state.loading = false;
//     },
//     userError(state, action: PayloadAction<UserErrorType>) {
//       state.error = action.payload;
//       state.loading = false;
//     },
//   },
// });

// export const { actions: userActions } = slice;

// export const useUserSlice = () => {
//   useInjectReducer({ key: slice.name, reducer: slice.reducer });
//   useInjectSaga({ key: slice.name, saga: userSaga });
//   return { actions: slice.actions };
// };

// /**
//  * Example Usage:
//  *
//  * export function MyComponentNeedingThisSlice() {
//  *  const { actions } = useUserSlice();
//  *
//  *  const onButtonClick = (evt) => {
//  *    dispatch(actions.someAction());
//  *   };
//  * }
//  */
