import { call, put, select, takeLeading } from 'redux-saga/effects';
import { initialState } from '.';
import { artworksActions } from '.';
import { selectUser } from 'app/pages/UserPage/slice/selectors';
import { selectCursor, selectFilter, selectCurrentArtwork } from './selectors';
import request from 'utils/request';
import { Artwork } from 'types/Artwork';
import { User } from 'types/User';
import { Cursor } from 'types/Cursor';
import { Filter } from 'types/Filter';
import {
  UPDATE_FILTER_SORT,
  UPDATE_RATING,
  GET_ARTWORKS,
  GET_ARTWORK_BY_ID,
} from 'app/constants';

console.log(`CLIENT | NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`CLIENT | PORT: ${process.env.PORT}`);
console.log(`CLIENT | REACT_APP_API_URL: ${process.env.REACT_APP_API_URL}`);

const developmentAppApiUrl =
  process.env.LOCAL_APP_API_URL || 'http://localhost:3001';
const productionAppApiUrl = process.env.REACT_APP_API_URL || false;

const API_ROOT = productionAppApiUrl || developmentAppApiUrl;

export function* getArtworkById(action) {
  const artworkId = action.payload;
  try {
    const user: User = yield select(selectUser);
    const userId = user.id || user.sub || 0;

    const requestURL = `${API_ROOT}/artworks/user/${userId}/id/${artworkId}/`;
    console.log(`getArtworkById | ARTWORK ID: ${artworkId} | ${requestURL}`);

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

    console.log(`getArtworkById | FETCHED ARTWORK | ID: ${artworkId}`);

    yield put(artworksActions.artworksLoaded({ artworks: [artwork], user }));
    yield put(artworksActions.setCurrentArtworkId(artwork.id));
    yield put(artworksActions.endLoadArtworks());
    yield put(artworksActions.setHasNextPage(false));
  } catch (err) {
    console.error(err);
    yield put(artworksActions.artworksError(err));
  }
}

export function* getArtworks(options) {
  try {
    yield put(artworksActions.startLoadArtworks());
    yield put(artworksActions.setHasNextPage(false));

    const user: User = yield select(selectUser);
    let cursor: Cursor = yield select(selectCursor);
    const filter: Filter = yield select(selectFilter);

    const userId = user.id || user.sub || 0;

    let tempCursor = { ...cursor };
    let value = 100;

    if (filter.topRated) {
      tempCursor.subDoc = 'rating';
      tempCursor.sort = 'rate';
      value = tempCursor.rate || value;
    }

    if (filter.topRecs) {
      tempCursor.subDoc = 'recommendation';
      tempCursor.sort = 'score';
      value = tempCursor.score || value;
    }

    if (filter.unrated) {
      tempCursor.subDoc = 'unrated';
    }

    let requestURL = '';

    if (
      !cursor.subDoc ||
      cursor.subDoc === undefined ||
      cursor.subDoc === null ||
      cursor.subDoc === 'none'
    ) {
      requestURL = `${API_ROOT}/artworks/user/${userId}/cursor/${tempCursor.id}/`;
    } else if (filter.unrated) {
      requestURL = `${API_ROOT}/artworks/user/${userId}/cursor/${tempCursor.id}/${tempCursor.subDoc}/`;
    } else {
      requestURL = `${API_ROOT}/artworks/user/${userId}/cursor/${tempCursor.id}/${tempCursor.subDoc}.${tempCursor.sort}.${value}/`;
    }

    console.log(`getArtworks | FETCH | URL: ${requestURL}`);

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
      `getArtworks | FETCHED ${artworks ? artworks.length : 0} ARTWORKS` +
        ` | CURSOR ID: ${results.nextKey ? results.nextKey.id : null}`,
    );

    const nextKey = results.nextKey;

    if (nextKey) {
      console.log(
        `getArtworks | URL: ${requestURL}` +
          ` | NEXTKEY` +
          ` | ID: ${nextKey.id}` +
          ` | RATE: ${nextKey.rate}` +
          ` | RATE AVE: ${nextKey.ratingAverage}` +
          ` | SCORE: ${nextKey.score}`,
      );
    } else {
      console.log(`getArtworks | XXX CURSOR END | URL: ${requestURL}`);
    }

    tempCursor = results.nextKey
      ? Object.assign({}, tempCursor, results.nextKey)
      : initialState.cursor;

    yield put(artworksActions.artworksLoaded({ artworks, user }));
    yield put(artworksActions.artworksFilterSort());
    yield put(artworksActions.setCursor({ cursor: tempCursor }));
    yield put(artworksActions.endLoadArtworks());
    yield put(artworksActions.setHasNextPage(results.nextKey !== undefined));
    return;
  } catch (err) {
    console.error(err);
    yield put(artworksActions.artworksError(err));
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
    console.log(
      `+++ RATING UPDATED | updateRating` +
        ` | ID: ${result.rating.id}` +
        ` | USER ID: ${result.rating.user.id}` +
        ` | ARTWORK ID: ${result.rating.artwork.id}` +
        ` | ARTWORK _ID: ${result.rating.artwork._id}` +
        ` | RATE: ${result.rating.rate}`,
    );
    const currentArtwork: Artwork = yield select(selectCurrentArtwork);
    const updatedArtwork = { ...currentArtwork };
    updatedArtwork.ratingUser = result.rating;
    yield put(
      artworksActions.artworksLoaded({
        artworks: [updatedArtwork],
        user: rating.user,
      }),
    );
    yield put(artworksActions.setCurrentArtworkId(updatedArtwork.id));
    yield put(artworksActions.endLoadArtworks());
  } catch (err) {
    console.error(err);
  }
}

export function* updateFilterSort(action) {
  const filter = action.payload.filter;
  console.log(
    `updateFilterSort` +
      ` | TOP RATED: ${filter.topRated}` +
      ` | TOP RECS: ${filter.topRecs}` +
      ` | UNRATED: ${filter.unrated}`,
  );

  try {
    yield put(artworksActions.updateFilterSort({ filter }));
  } catch (err) {
    throw err;
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* artworksSaga() {
  yield takeLeading(UPDATE_FILTER_SORT, updateFilterSort);
  yield takeLeading(UPDATE_RATING, updateRating);
  yield takeLeading(GET_ARTWORK_BY_ID, getArtworkById);
  yield takeLeading(GET_ARTWORKS, getArtworks);
}
