/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectGlobal = state => state.global || initialState;

const selectRouter = state => state.router;

const makeSelectCurrentUser = () =>
  createSelector(selectGlobal, globalState => globalState.currentUser);

const makeSelectCurrentArtwork = () =>
  createSelector(selectGlobal, globalState => globalState.currentArtwork);

const makeSelectFilter = () =>
  createSelector(selectGlobal, globalState => globalState.filter);

const makeSelectCursor = () =>
  createSelector(selectGlobal, globalState => globalState.cursor);

const makeSelectLoading = () =>
  createSelector(selectGlobal, globalState => globalState.loading);

const makeSelectError = () =>
  createSelector(selectGlobal, globalState => globalState.error);

const makeSelectArtworks = () =>
  createSelector(selectGlobal, globalState => globalState.artworks);

const makeSelectArtwork = id =>
  createSelector(selectGlobal, globalState =>
    globalState.artworks.find(artwork => artwork.id === id),
  );

const makeSelectLocation = () =>
  createSelector(selectRouter, routerState => routerState.location);

export {
  selectGlobal,
  makeSelectFilter,
  makeSelectCursor,
  makeSelectCurrentUser,
  makeSelectCurrentArtwork,
  makeSelectLoading,
  makeSelectError,
  makeSelectArtworks,
  makeSelectArtwork,
  makeSelectLocation,
};
