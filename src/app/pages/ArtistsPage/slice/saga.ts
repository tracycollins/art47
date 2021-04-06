// import { useSelector, useDispatch } from 'react-redux';
import {
  // take,
  call,
  put,
  select,
  delay,
  takeLeading,
} from 'redux-saga/effects';
import { artistsActions } from '.';
import { selectUser } from 'app/pages/UserPage/slice/selectors';
import { selectCursor } from './selectors';
import request from 'utils/request';
import { User } from 'types/User';
import { Cursor } from 'types/Cursor';
import { GET_ARTISTS, GET_ARTIST_BY_ID } from 'app/constants';

console.log(`CLIENT | NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`CLIENT | PORT: ${process.env.PORT}`);
console.log(`CLIENT | REACT_APP_API_URL: ${process.env.REACT_APP_API_URL}`);

const developmentAppApiUrl =
  process.env.LOCAL_APP_API_URL || 'http://localhost:3001';
const productionAppApiUrl = process.env.REACT_APP_API_URL || false;

const API_ROOT = productionAppApiUrl || developmentAppApiUrl;

export function* getArtistById(action) {
  const artistId = action.payload;
  console.log(`artistId | API_ROOT: ${API_ROOT} | ARTIST ID: ${artistId}`);
  try {
    yield put(artistsActions.loadArtists());
    yield delay(100);

    const user: User = yield select(selectUser);
    const userId = user.id || user.sub || 0;

    const requestURL = `${API_ROOT}/artists/user/${userId}/id/${artistId}/`;

    const results = yield call(request, requestURL);
    const artist = results.artist;

    console.log(`ArtistsPage | FETCHED ARTIST | ID: ${artistId}`);

    yield put(artistsActions.artistsLoaded({ artists: [artist] }));
    yield put(artistsActions.setCurrentArtistId(artist.id));
    yield put(artistsActions.loadArtistsComplete());
  } catch (err) {
    console.error(err);
    // yield put(artistsLoadingError(err));
  }
}

export function* getArtists(options) {
  console.log(`getArtists | API_ROOT: ${API_ROOT}`);
  try {
    yield put(artistsActions.loadArtists());
    yield delay(500);

    let cursor: Cursor = yield select(selectCursor);

    // const user: User = yield select(selectUser);
    // const userId = user.id || user.sub || 0;

    let tempCursor = { ...cursor };
    console.log({ tempCursor });

    let requestURL = `${API_ROOT}/artists/cursor/${tempCursor._id}`;
    console.log({ requestURL });

    const results = yield call(request, requestURL);

    const artists = [...results.artists];

    console.log(
      `ArtistsPage | FETCHED ${
        artists ? artists.length : 0
      } ARTISTS | CURSOR ID: ${results.nextKey ? results.nextKey._id : null}`,
    );

    tempCursor =
      results.artists.length < 20
        ? { ...tempCursor, _id: 0 }
        : Object.assign({}, tempCursor, results.nextKey);
    yield put(artistsActions.artistsLoaded({ artists, cursor: tempCursor }));
    yield put(artistsActions.artistsFilterSort());
    yield put(artistsActions.loadArtistsComplete());
  } catch (err) {
    console.error(err);

    yield put(artistsActions.artistsError(err));
  }
}

export function* artistsSaga() {
  yield takeLeading(GET_ARTIST_BY_ID, getArtistById);
  yield takeLeading(GET_ARTISTS, getArtists);
}
