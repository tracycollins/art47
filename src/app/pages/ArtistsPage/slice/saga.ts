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
import { initialState } from '.';
import { artworksActions } from 'app/pages/ArtworksPage/slice/index';
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
    yield delay(100);

    const user: User = yield select(selectUser);
    const userId = user.id || user.sub || 0;

    const requestURL = `${API_ROOT}/artists/user/${userId}/id/${artistId}/artworks`;
    console.log(`getArtistById | ARTIST ID: ${artistId} | ${requestURL}`);

    const results = yield call(request, requestURL);
    const artist = results.artist;

    console.log(
      `ArtistsPage | FETCHED ARTIST` +
        ` | ID: ${artistId}` +
        ` | _ID: ${artist.id}` +
        ` | ${artist.artworks.length} ARTWORKS`,
    );

    yield put(artistsActions.artistsLoaded({ artists: [artist], user }));
    yield put(artworksActions.artworksLoaded({ artworks: artist.artworks }));
    yield put(artworksActions.endLoadArtworks());
    yield put(artworksActions.setHasNextPage(false));
    yield put(artistsActions.setCurrentArtistId(artist.id));
    yield put(artistsActions.endLoadArtists());
    yield put(artistsActions.setHasNextPage(false));
  } catch (err) {
    console.error(err);
    yield put(artistsActions.artistsError(err));
  }
}

export function* getArtists(options) {
  try {
    console.log(`getArtists`);

    yield put(artistsActions.startLoadArtists());
    yield put(artistsActions.setHasNextPage(false));

    const user: User = yield select(selectUser);
    let cursor: Cursor = yield select(selectCursor);
    // const filter: Filter = yield select(selectFilter);

    // const userId = user.id || user.sub || 0;

    let tempCursor = { ...cursor };
    console.log({ tempCursor });

    let requestURL = `${API_ROOT}/artists/cursor/${tempCursor.id}`;

    console.log(`getArtists | FETCH | URL: ${requestURL}`);

    const results = yield call(request, requestURL);
    const artists = [...results.artists];

    console.log(
      `ArtistsPage | FETCHED ${
        artists ? artists.length : 0
      } ARTISTS | CURSOR ID: ${results.nextKey ? results.nextKey.id : null}`,
    );

    const nextKey = results.nextKey;

    if (nextKey) {
      console.log(
        `getArtists | NEXTKEY | ID: ${nextKey.id} | URL: ${requestURL}`,
      );
    } else {
      console.log(`getArtists | XXX CURSOR END | URL: ${requestURL}`);
    }

    tempCursor = results.nextKey
      ? Object.assign({}, tempCursor, results.nextKey)
      : initialState.cursor;

    console.log({ tempCursor });
    yield put(artistsActions.artistsLoaded({ artists, user }));
    yield put(artistsActions.artistsFilterSort());
    yield put(artistsActions.setCursor({ cursor: tempCursor }));
    yield put(artistsActions.endLoadArtists());
    yield put(artistsActions.setHasNextPage(results.nextKey !== undefined));
    return;
  } catch (err) {
    console.error(err);
    yield put(artistsActions.artistsError(err));
  }
}

export function* artistsSaga() {
  yield takeLeading(GET_ARTIST_BY_ID, getArtistById);
  yield takeLeading(GET_ARTISTS, getArtists);
}
