import { put, call, takeLeading, select } from 'redux-saga/effects';
import request from 'utils/request';
import { selectUser } from './selectors';
import { User } from 'types/User';
import {
  GET_USER,
  SET_USER,
  UPDATE_USER,
  UPLOAD_FILE,
  AUTHENTICATED_USER,
  GET_USER_TOP_UNRATED_RECS,
} from 'app/constants';
import { userActions as actions } from '.';
import { artworksActions } from 'app/pages/ArtworksPage/slice';

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
    if (user && user._id) {
      yield put(actions.getUserTopUnratedRecArtworks({ user }));
    }
  } catch (err) {
    console.error(err);
    yield put(actions.userError(err));
  }
}

export function* getUser(params) {
  try {
    const user = params.payload;
    console.log(`SAGA | getUser | USER SUB: ${user.sub} API_ROOT: ${API_ROOT}`);

    const requestURL = `${API_ROOT}/users/${user.sub}/`;

    const dbUser = yield call(request, requestURL);
    const newUser = Object.assign({}, user, dbUser);
    console.log(
      `SAGA | getUser | DB USER: _ID: ${newUser._id} ID: ${newUser.id}`,
    );
    yield put(actions.userLoaded(newUser));
    yield put(actions.getUserTopUnratedRecArtworks({ user: newUser }));
  } catch (err) {
    console.error(err);
    yield put(actions.userError(err));
  }
}

export function* getUserTopUnratedRecArtworks(params) {
  try {
    yield put(artworksActions.startLoadArtworks());
    const user = params.payload.user;
    console.log(
      `SAGA | getUserTopUnratedRecArtworks` +
        ` | USER _ID: ${user._id}` +
        ` | UNRATED: ${user.unrated ? user.unrated.length : 0}`,
    );

    const requestURL = `${API_ROOT}/artworks/user/${user.sub}/recs/top/`;

    const { artworks } = yield call(request, requestURL);
    console.log(
      `SAGA | getUserTopUnratedRecArtworks | USER: _ID: ${user._id} | ARTWORKS: ${artworks.length}`,
    );
    yield put(artworksActions.artworksLoaded({ artworks }));
    yield put(artworksActions.artworksFilterSort());
    yield put(artworksActions.endLoadArtworks());
  } catch (err) {
    console.error(err);
    yield put(actions.userError(err));
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

    const { type, dataType, file } = action.payload;

    console.log(
      `uploadFile | TYPE: ${type} | DATA TYPE: ${dataType} | FILE: ${file.name} | FILE SIZE: ${file.size}`,
    );

    const fileName = file.name;
    let data = new FormData();
    const oauthID = user.oauthID || '';
    data.append('profileImage', file);
    data.append('file_name', fileName);
    data.append('oauthID', oauthID);
    // data.append('user', subUser);
    const POST_FILE_OPTIONS = {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      // headers: {
      //   'Content-Type': 'multipart/form-data',
      // },
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      // body: JSON.stringify(data), // body data type must match "Content-Type" header
    };

    const options = {
      ...POST_FILE_OPTIONS,
      body: data,
    };

    const result = yield call(request, requestURL, options);
    console.log({ result });
    const updatedUser = { ...user, ...result.user };

    yield put(actions.setUser(updatedUser));
    yield put(actions.userLoaded(updatedUser));
  } catch (err) {
    console.error(err);
    yield put(actions.userError(err));
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
    yield put(actions.userError(err));
  }
}

export function* userSaga() {
  yield takeLeading(SET_USER, setCurrentUser);
  yield takeLeading(GET_USER, getUser);
  yield takeLeading(UPDATE_USER, updateUser);
  yield takeLeading(UPLOAD_FILE, uploadFile);
  yield takeLeading(AUTHENTICATED_USER, authenticatedUser);
  yield takeLeading(GET_USER_TOP_UNRATED_RECS, getUserTopUnratedRecArtworks);
}
