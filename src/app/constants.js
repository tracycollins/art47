/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';

export const INITIAL_STATE = {
  loading: false,
  error: false,
  currentUser: { sub: '0' },
  currentArtwork: false,
  cursor: {
    _id: 0,
    sortType: 'all',
    subDoc: null,
    sort: null,
    rate: 6,
    score: 2,
    value: 0,
  },
  filter: {
    topRated: false,
    topRecs: false,
    unrated: false,
  },
  artworks: [],
};

export const SET_FILTER = 'artworks/SET_FILTER';
export const SET_CURSOR = 'artworks/SET_CURSOR';
export const UPDATE_RATING = 'artworks/UPDATE_RATING';
export const UPDATE_RATING_SUCCESS = 'artworks/UPDATE_RATING_SUCCESS';
export const UPDATE_RATING_ERROR = 'artworks/UPDATE_RATING_ERROR';
export const GET_USER = 'user/getUser';
export const SET_USER = 'user/setUser';
export const SET_CURRENT_USER_SUCCESS = 'artworks/SET_CURRENT_USER_SUCCESS';
export const SET_CURRENT_USER_ERROR = 'artworks/SET_CURRENT_USER_ERROR';
export const SET_CURRENT_ARTWORK = 'artworks/SET_CURRENT_ARTWORK';
export const SET_ARTWORKS = 'artworks/setArtworks';
export const GET_ARTWORKS = 'artworks/getArtworks';
export const GET_ARTWORK_BY_ID = 'artworks/getArtworkById';
export const GET_ARTWORKS_SUCCESS = 'artworks/GET_ARTWORKS_SUCCESS';
export const GET_ARTWORKS_ERROR = 'artworks/GET_ARTWORKS_ERROR';
export const ARTWORKS_FILTER_SORT = 'artworks/ARTWORKS_FILTER_SORT';
