import { put, call, takeLeading, delay } from 'redux-saga/effects';
// import { userActions as actions } from '.';
import request from 'utils/request';
// import { selectUser } from './selectors';
// import { User } from 'types/User';
import { GET_USER, SET_USER } from 'app/constants';
import { userActions as actions } from '.';

// console.log({ actions });

const developmentAppApiUrl =
  process.env.LOCAL_APP_API_URL || 'http://localhost:3001';
const productionAppApiUrl = process.env.REACT_APP_API_URL || false;

const API_ROOT = productionAppApiUrl || developmentAppApiUrl;

export function* setCurrentUser(params) {
  // console.log({ params });
  const user = params.payload;
  try {
    console.log(
      `SAGA | setCurrentUser | USER ID: ${
        user ? user.id || user._id : 'UNDEFINED'
      }`,
    );

    yield put(actions.setUser(user));
  } catch (err) {
    console.error(err);
  }
}

export function* getUser(params) {
  try {
    yield delay(500);
    const user = params.payload;
    console.log(`SAGA | getUser | USER SUB: ${user.sub} API_ROOT: ${API_ROOT}`);
    // console.log({ params });

    console.log({ user });

    const requestURL = `${API_ROOT}/users/${user.sub}/`;

    // console.log({ requestURL });
    const dbUser = yield call(request, requestURL);
    const newUser = Object.assign({}, user, dbUser);
    console.log(
      `SAGA | getUser | DB USER: _ID: ${newUser._id} ID: ${newUser.id}`,
    );
    yield put(actions.userLoaded(newUser));
  } catch (err) {
    console.error(err);
  }
}
export function* userSaga() {
  yield takeLeading(SET_USER, setCurrentUser);
  yield takeLeading(GET_USER, getUser);
}
