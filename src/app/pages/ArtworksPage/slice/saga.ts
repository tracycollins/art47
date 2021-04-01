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
import { selectCursor, selectCurrentArtwork } from './selectors';
// import { selectArtworks } from './selectors';
import request from 'utils/request';
import { Artwork } from 'types/Artwork';
import { User } from 'types/User';
import { Cursor } from 'types/Cursor';
import { UPDATE_RATING, GET_ARTWORKS, GET_ARTWORK_BY_ID } from 'app/constants';

console.log(`CLIENT | NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`CLIENT | PORT: ${process.env.PORT}`);
console.log(`CLIENT | REACT_APP_API_URL: ${process.env.REACT_APP_API_URL}`);

const developmentAppApiUrl =
  process.env.LOCAL_APP_API_URL || 'http://localhost:3001';
const productionAppApiUrl = process.env.REACT_APP_API_URL || false;

const API_ROOT = productionAppApiUrl || developmentAppApiUrl;

export function* getArtworkById(action) {
  const artworkId = action.payload;
  console.log(`artworkId | API_ROOT: ${API_ROOT} | ARTWORK ID: ${artworkId}`);
  try {
    yield delay(100);

    const user: User = yield select(selectUser);
    const userId = user.id || user.sub || 0;

    const requestURL = `${API_ROOT}/artworks/user/${userId}/id/${artworkId}/`;

    const results = yield call(request, requestURL);
    const artwork = results.artwork;

    if (user._id) {
      if (artwork.ratings && artwork.ratings.length > 0) {
        artwork.ratings.forEach(rating => {
          if (rating.user === user._id) {
            artwork.ratingUser = rating;
            artwork.ratingUser.user = user;
          }
        });
      }
      if (artwork.recommendations && artwork.recommendations.length > 0) {
        for (let j = 0; j < artwork.recommendations.length; j += 1) {
          if (artwork.recommendations[j].user === user._id) {
            artwork.recommendationUser = artwork.recommendations[j];
            artwork.recommendationUser.user = user;
          }
        }
      }
    }

    console.log(`ArtworksPage | FETCHED ARTWORK | ID: ${artworkId}`);

    yield put(artworksActions.artworksLoaded({ artworks: [artwork] }));
    yield put(artworksActions.setCurrentArtworkId(artwork.id));
  } catch (err) {
    console.error(err);

    // yield put(artworksLoadingError(err));
  }
}

export function* getArtworks(options) {
  console.log(`getArtworks | API_ROOT: ${API_ROOT}`);
  try {
    yield delay(500);

    const user: User = yield select(selectUser);
    let cursor: Cursor = yield select(selectCursor);

    const filter = { topRecs: false, topRated: false, unrated: false };
    const userId = user.id || user.sub || 0;

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
      requestURL = `${API_ROOT}/artworks/user/${userId}/cursor/${cursor._id}/`;
    } else if (filter.unrated) {
      // '/artworks/user/:userId/cursor/:cursorid/(:subdoc)?(.:sort.:value)?',
      requestURL = `${API_ROOT}/artworks/user/${userId}/cursor/${cursor._id}/${cursor.subDoc}/`;
    } else {
      requestURL = `${API_ROOT}/artworks/user/${userId}/cursor/${cursor._id}/${
        cursor.subDoc
      }.${cursor.sort}.${cursor[cursor.sort] || 999}/`;
    }
    const results = yield call(request, requestURL);
    const artworks = [...results.artworks];

    if (user._id) {
      for (let i = 0; i < artworks.length; i += 1) {
        if (artworks[i].ratings && artworks[i].ratings.length > 0) {
          artworks[i].ratings.forEach(rating => {
            if (rating.user === user._id) {
              artworks[i].ratingUser = rating;
              artworks[i].ratingUser.user = user;
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
              artworks[i].recommendationUser.user = user;
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
  const rating = action.payload.rating;
  console.log(
    `updateRating` +
      ` | ID: ${rating.id}` +
      ` | USER ID: ${rating.user.id}` +
      ` | ARTWORK ID: ${rating.artwork.id}` +
      ` | ARTWORK _ID: ${rating.artwork._id}` +
      ` | RATE: ${rating.rate}`,
  );

  try {
    const requestURL = `${API_ROOT}/ratings/create/`;

    const options = {
      ...POST_OPTIONS,
      body: JSON.stringify(rating),
    };

    const result = yield call(request, requestURL, options);
    console.log({ result });

    const currentArtwork: Artwork = yield select(selectCurrentArtwork);
    // const updatedArtwork = Object.assign({}, currentArtwork);
    const updatedArtwork = { ...currentArtwork };
    updatedArtwork.ratingUser = result.rating;
    // yield put(ratingUpdated(rating));
    yield put(artworksActions.artworksLoaded({ artworks: [updatedArtwork] }));
    yield put(artworksActions.setCurrentArtworkId(updatedArtwork.id));
  } catch (err) {
    console.error(err);

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
  yield takeLeading(UPDATE_RATING, updateRating);
  yield takeLeading(GET_ARTWORK_BY_ID, getArtworkById);
  yield takeLeading(GET_ARTWORKS, getArtworks);
}
