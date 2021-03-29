/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import {
  SET_FILTER,
  ARTWORKS_FILTER_SORT,
  SET_CURSOR,
  SET_CURRENT_USER,
  SET_CURRENT_USER_SUCCESS,
  SET_CURRENT_USER_ERROR,
  SET_CURRENT_ARTWORK,
  LOAD_ARTWORKS_SUCCESS,
  UPDATE_RATING,
  UPDATE_RATING_SUCCESS,
  UPDATE_RATING_ERROR,
  LOAD_ARTWORKS,
  LOAD_ARTWORKS_ERROR,
  INITIAL_STATE,
} from './constants';

// The initial state of the App
export const initialState = INITIAL_STATE;

// const sortByKey = key => (a, b) => (a[key] > b[key] ? 1 : -1);

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_FILTER:
        draft.filter = action.filter;
        draft.cursor = action.cursor || INITIAL_STATE.cursor;
        break;

      case ARTWORKS_FILTER_SORT:
        draft.filter = action.filter;
        draft.sort = action.sort;

        if (action.filter && action.filter.topRated) {
          draft.artworks = draft.artworks.filter(
            artwork => artwork.ratingUser && artwork.ratingUser.rate !== null,
          );
          draft.artworks.sort((a, b) =>
            a.ratingUser.rate > b.ratingUser.rate ? -1 : 1,
          );
          break;
        }

        if (action.filter && action.filter.topRecs) {
          draft.artworks = draft.artworks.filter(
            artwork =>
              artwork.recommendationUser &&
              artwork.recommendationUser.score !== null,
          );

          draft.artworks.sort((a, b) =>
            a.recommendationUser.score > b.recommendationUser.score ? -1 : 1,
          );
          break;
        }

        if (action.filter && action.filter.unrated) {
          draft.artworks = draft.artworks.filter(
            artwork =>
              artwork.ratingUser === undefined ||
              artwork.ratingUser.rate === null,
          );
        }

        // draft.artworks = [...draft.artworks];
        break;

      case SET_CURSOR:
        draft.cursor = action.cursor;
        break;

      case SET_CURRENT_USER:
        // draft.currentUser = action.user;
        draft.loading = true;
        draft.error = false;
        break;

      case SET_CURRENT_USER_SUCCESS:
        draft.currentUser = action.currentUser;
        draft.loading = false;
        draft.error = false;
        break;

      case SET_CURRENT_USER_ERROR:
        draft.currentUser = initialState.currentUser;
        draft.error = action.error;
        draft.loading = false;
        break;

      case SET_CURRENT_ARTWORK:
        draft.currentArtwork = action.currentArtwork;
        break;

      case UPDATE_RATING:
        draft.rating = action.rating;
        draft.loading = true;
        draft.error = false;
        break;

      case UPDATE_RATING_SUCCESS:
        draft.rating = action.rating;
        draft.currentArtwork.ratingUser = action.rating;
        draft.artworks = draft.artworks.map(artwork => {
          if (artwork.id === action.rating.artwork.id) {
            artwork.ratingUser = action.rating;
          }
          return artwork;
        });
        draft.loading = false;
        break;

      case UPDATE_RATING_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      case LOAD_ARTWORKS:
        draft.loading = true;
        draft.error = false;
        break;

      case LOAD_ARTWORKS_SUCCESS:
        draft.artworks = draft.artworks.filter(
          artwork =>
            !action.artworks.some(newArtwork => newArtwork._id === artwork._id),
        );
        draft.artworks = [...draft.artworks, ...action.artworks];
        draft.artworks = draft.artworks.map(artwork => {
          if (artwork.ratings !== undefined && artwork.ratings.length > 0) {
            for (let i = 0; i < artwork.ratings.length; i += 1) {
              if (artwork._id === artwork.ratings[i].artwork) {
                // ratings artwork not populated; should be mongo db _id
                artwork.ratingUser = artwork.ratings[i];
              }
            }
          }
          if (
            artwork.recommendations !== undefined &&
            artwork.recommendations.length > 0
          ) {
            for (let i = 0; i < artwork.recommendations.length; i += 1) {
              if (artwork._id === artwork.recommendations[i].artwork) {
                artwork.recommendationUser = artwork.recommendations[i];
              }
            }
          }
          return artwork;
        });
        draft.loading = false;
        break;

      case LOAD_ARTWORKS_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
    }
  });

export default appReducer;
