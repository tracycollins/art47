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

export const SET_FILTER = 'art47/App/SET_FILTER';
export const SET_CURSOR = 'art47/App/SET_CURSOR';
export const UPDATE_RATING = 'art47/App/UPDATE_RATING';
export const UPDATE_RATING_SUCCESS = 'art47/App/UPDATE_RATING_SUCCESS';
export const UPDATE_RATING_ERROR = 'art47/App/UPDATE_RATING_ERROR';
export const SET_CURRENT_USER = 'art47/App/SET_CURRENT_USER';
export const SET_CURRENT_USER_SUCCESS = 'art47/App/SET_CURRENT_USER_SUCCESS';
export const SET_CURRENT_USER_ERROR = 'art47/App/SET_CURRENT_USER_ERROR';
export const SET_CURRENT_ARTWORK = 'art47/App/SET_CURRENT_ARTWORK';
export const LOAD_ARTWORKS = 'art47/App/LOAD_ARTWORKS';
export const LOAD_ARTWORKS_SUCCESS = 'art47/App/LOAD_ARTWORKS_SUCCESS';
export const LOAD_ARTWORKS_ERROR = 'art47/App/LOAD_ARTWORKS_ERROR';
export const ARTWORKS_FILTER_SORT = 'art47/App/ARTWORKS_FILTER_SORT';
