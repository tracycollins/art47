import { put, call, takeLeading, delay, select } from 'redux-saga/effects';
import request from 'utils/request';
import { selectUser } from './selectors';
import { User } from 'types/User';
import {
  GET_USER,
  SET_USER,
  UPDATE_USER,
  UPLOAD_FILE,
  AUTHENTICATED_USER,
} from 'app/constants';
import { userActions as actions } from '.';

const developmentAppApiUrl =
  process.env.LOCAL_APP_API_URL || 'http://localhost:3001';
const productionAppApiUrl = process.env.REACT_APP_API_URL || false;

const API_ROOT = productionAppApiUrl || developmentAppApiUrl;

export function* setCurrentUser(params) {
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

    const requestURL = `${API_ROOT}/users/${user.sub}/`;

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

const POST_OPTIONS = {
  method: 'POST', // *GET, POST, PUT, DELETE, etc.
  headers: {
    'Content-Type': 'application/json',
  },
  referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  // body: JSON.stringify(data), // body data type must match "Content-Type" header
};

export function* updateUser(action) {
  const user = action.payload.user;
  console.log(
    `updateUser` +
      // ` | ID: ${user.id}` +
      // ` | _ID: ${user._id}` +
      ` | SUB: ${user.sub}`,
  );

  try {
    const requestURL = `${API_ROOT}/users/update/`;

    const options = {
      ...POST_OPTIONS,
      body: JSON.stringify(user),
    };

    const result = yield call(request, requestURL, options);
    // console.log({ result });

    const currentUser: User = yield select(selectUser);
    // console.log({ currentUser });
    const updatedUser = Object.assign({}, currentUser, result);
    // console.log({ updatedUser });
    yield put(actions.setUser(updatedUser));
    yield put(actions.userLoaded(updatedUser));
  } catch (err) {
    console.error(err);

    // yield put(userUpdateError(err));
  }
}

export function* uploadFile(action) {
  try {
    const requestURL = `${API_ROOT}/users/upload/`;
    const user: User = yield select(selectUser);

    const uploadObj = action.payload;
    uploadObj.user = user;

    console.log(
      `uploadFile | TYPE: ${uploadObj.type} | DATA TYPE: ${uploadObj.dataType} | DATA SIZE: ${uploadObj.data.byteLength}`,
    );
    console.log({ uploadObj });

    const options = {
      ...POST_OPTIONS,
      body: JSON.stringify(uploadObj),
    };
    const result = yield call(request, requestURL, options);

    console.log({ result });
  } catch (err) {
    console.error(err);

    // yield put(userUpdateError(err));
  }
}

export function* authenticatedUser(action) {
  const user = action.payload;
  console.log(`authenticatedUser | SUB: ${user.sub}`);

  try {
    const requestURL = `${API_ROOT}/authenticated`;

    const options = {
      ...POST_OPTIONS,
      body: JSON.stringify(user),
    };

    const result = yield call(request, requestURL, options);

    const currentUser: User = yield select(selectUser);
    const updatedUser = { ...currentUser, ...result.user };

    yield put(actions.setUser(updatedUser));
    yield put(actions.userLoaded(updatedUser));
  } catch (err) {
    console.error(err);

    // yield put(userUpdateError(err));
  }
}

export function* userSaga() {
  yield takeLeading(SET_USER, setCurrentUser);
  yield takeLeading(GET_USER, getUser);
  yield takeLeading(UPDATE_USER, updateUser);
  yield takeLeading(UPLOAD_FILE, uploadFile);
  yield takeLeading(AUTHENTICATED_USER, authenticatedUser);
}
