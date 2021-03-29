/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  ARTWORKS_FILTER_SORT,
  LOAD_ARTWORKS,
  LOAD_ARTWORKS_SUCCESS,
  LOAD_ARTWORKS_ERROR,
  SET_CURRENT_USER,
  SET_CURRENT_USER_SUCCESS,
  SET_CURRENT_USER_ERROR,
  SET_CURRENT_ARTWORK,
  SET_FILTER,
  SET_CURSOR,
  UPDATE_RATING,
  UPDATE_RATING_ERROR,
  UPDATE_RATING_SUCCESS,
} from './constants';

/**
 * Load the repositories, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_ARTWORKS
 */
export function loadArtworks() {
  return {
    type: LOAD_ARTWORKS,
  };
}

/**
 * Dispatched when the repositories are loaded by the request saga
 *
 * @param  {array} artworks The artworks data
 * @param  {string} currentUser
 *
 * @return {object}      An action object with a type of LOAD_ARTWORKS_SUCCESS passing the repos
 */
export function artworksLoaded(artworks) {
  return {
    type: LOAD_ARTWORKS_SUCCESS,
    artworks,
  };
}

export function artworksFilterSort({ filter, sort }) {
  return {
    type: ARTWORKS_FILTER_SORT,
    filter,
    sort,
  };
}

export function setFilter(filter) {
  return {
    type: SET_FILTER,
    filter,
  };
}

export function setCursor(cursor) {
  return {
    type: SET_CURSOR,
    cursor,
  };
}

export function updateRating(rating) {
  return {
    type: UPDATE_RATING,
    rating,
  };
}

export function ratingUpdated(rating) {
  return {
    type: UPDATE_RATING_SUCCESS,
    rating,
  };
}

export function ratingUpdateError(error) {
  return {
    type: UPDATE_RATING_ERROR,
    error,
  };
}

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user,
  };
}

export function currentUserSet(currentUser) {
  return {
    type: SET_CURRENT_USER_SUCCESS,
    currentUser,
  };
}

export function setCurrentUserError(error) {
  return {
    type: SET_CURRENT_USER_ERROR,
    error,
  };
}

export function setCurrentArtwork(currentArtwork) {
  return {
    type: SET_CURRENT_ARTWORK,
    currentArtwork,
  };
}

/**
 * Dispatched when loading the repositories fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of LOAD_ARTWORKS_ERROR passing the error
 */
export function artworksLoadingError(error) {
  return {
    type: LOAD_ARTWORKS_ERROR,
    error,
  };
}
