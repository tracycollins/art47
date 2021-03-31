// import { useSelector, useDispatch } from 'react-redux';
import {
  // take,
  call,
  put,
  select,
  delay,
  takeLeading,
} from 'redux-saga/effects';
import { artworksActions } from '.';
import { selectUser } from 'app/pages/UserPage/slice/selectors';
import { selectCursor } from './selectors';
// import { selectArtworks } from './selectors';
import request from 'utils/request';
// import { Artwork } from 'types/Artwork';
import { User } from 'types/User';
import { Cursor } from 'types/Cursor';
import { GET_ARTWORKS } from 'app/constants';

console.log(`CLIENT | NODE_ENV:          ${process.env.NODE_ENV}`);
console.log(`CLIENT | PORT:          ${process.env.PORT}`);
console.log(`CLIENT | REACT_APP_API_URL: ${process.env.REACT_APP_API_URL}`);

const developmentAppApiUrl =
  process.env.LOCAL_APP_API_URL || 'http://localhost:3001';
const productionAppApiUrl = process.env.REACT_APP_API_URL || false;

const API_ROOT = productionAppApiUrl || developmentAppApiUrl;

export function* getArtworks(options) {
  console.log({ options });
  console.log({ artworksActions });

  console.log(`getArtworks | API_ROOT: ${API_ROOT}`);
  try {
    yield delay(500);

    const user: User = yield select(selectUser);
    let cursor: Cursor = yield select(selectCursor);
    // let artworks: Artwork[] = yield select(selectArtworks);

    // const user = selectUser(state);
    // const cursor = yield select(makeSelectCursor());
    // const filter = yield select(makeSelectFilter());

    console.log({ user });
    // console.log({ cursor });
    // console.log({ filter });

    const filter = { topRecs: false, topRated: false, unrated: false };
    // let cursor = { _id: 0, subDoc: 'none', sort: 'none' };

    const userid = user.id || user.sub;

    if (filter.topRated) {
      cursor.subDoc = 'rating';
      cursor.sort = 'rate';
    }

    if (filter.topRated) {
      cursor.subDoc = 'rating';
      cursor.sort = 'rate';
    }

    if (filter.unrated) {
      cursor.subDoc = 'unrated';
    }

    let requestURL = '';

    if (cursor.subDoc === 'none') {
      requestURL = `${API_ROOT}/artworks/user/${userid}/cursor/${cursor._id}/`;
    } else if (filter.unrated) {
      // '/artworks/user/:userid/cursor/:cursorid/(:subdoc)?(.:sort.:value)?',
      requestURL = `${API_ROOT}/artworks/user/${userid}/cursor/${cursor._id}/${cursor.subDoc}/`;
    } else {
      requestURL = `${API_ROOT}/artworks/user/${userid}/cursor/${cursor._id}/${
        cursor.subDoc
      }.${cursor.sort}.${cursor[cursor.sort] || 999}/`;
    }
    console.log({ requestURL });
    const results = yield call(request, requestURL);
    const artworks = [...results.artworks];

    // console.log({ results });

    // console.log(`nextKey:`, results.nextKey);

    if (user._id) {
      for (let i = 0; i < artworks.length; i += 1) {
        if (artworks[i].ratings && artworks[i].ratings.length > 0) {
          artworks[i].ratings.forEach(rating => {
            if (rating.user === user._id) {
              artworks[i].ratingUser = rating;
            }
          });
        }
        if (
          artworks[i].recommendations &&
          artworks[i].recommendations.length > 0
        ) {
          for (let j = 0; j < artworks[i].recommendations.length; j += 1) {
            if (artworks[i].recommendations[j].user === user._id) {
              artworks[i].recommendationUser = artworks[i].recommendations[j];
            }
          }
        }
      }
    }

    console.log(
      `ArtworksPage | FETCHED ${
        artworks ? artworks.length : 0
      } ARTWORKS | CURSOR ID: ${results.nextKey ? results.nextKey._id : null}`,
    );

    const tempCursor =
      results.artworks.length < 20
        ? { _id: 0 }
        : Object.assign({}, cursor, results.nextKey);
    yield put(artworksActions.artworksLoaded({ artworks, cursor: tempCursor }));
    // const tempCursor =
    //   results.artworks.length < 20
    //     ? { _id: 0 }
    //     : Object.assign({}, cursor, results.nextKey);

    // yield put(setCursor(tempCursor));
    // return { artworks, cursor };
  } catch (err) {
    console.error(err);

    // yield put(artworksLoadingError(err));
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

export function* updateRating(action) {
  console.log(`updateRating | API_ROOT: ${API_ROOT}`);
  console.log(
    `updateRating` +
      ` | ID: ${action.rating.id}` +
      ` | USER ID: ${action.rating.user.id}` +
      ` | ARTWORK ID: ${action.rating.artwork.id}` +
      ` | ARTWORK _ID: ${action.rating.artwork._id}` +
      ` | RATE: ${action.rating.rate}`,
  );
  console.log({ action });

  try {
    const requestURL = `${API_ROOT}/ratings/create/`;

    // console.log({ requestURL });

    const options = {
      ...POST_OPTIONS,
      body: JSON.stringify(action.rating),
    };

    const { rating } = yield call(request, requestURL, options);
    console.log({ rating });
    // yield put(ratingUpdated(rating));
    // yield put(artworksLoaded([artwork]));
  } catch (err) {
    // yield put(ratingUpdateError(err));
  }
}

// export function* updateFilter(action) {
//   console.log(`updateFilter | API_ROOT: ${API_ROOT}`);
//   console.log(
//     `updateFilter` +
//       ` | TOP RATED: ${action.filter.topRated}` +
//       ` | TOP RECS: ${action.filter.topRecs}` +
//       ` | UNRATED: ${action.filter.unrated}`,
//   );
//   console.log({ action });

//   try {
//     yield put(setFilter(action.filter));
//     yield put(artworksFilterSort({ filter: action.filter }));
//   } catch (err) {
//     throw err;
//   }
// }

/**
 * Root saga manages watcher lifecycle
 */
export function* artworksSaga() {
  // yield takeLeading(SET_FILTER, updateFilter);
  // yield takeLeading(UPDATE_RATING, updateRating);
  yield takeLeading(GET_ARTWORKS, getArtworks);
}
