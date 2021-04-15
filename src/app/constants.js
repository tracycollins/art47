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
  loaded: null,
  loading: false,
  error: false,
  currentUser: { sub: '0' },
  currentArtwork: false,
  cursor: {
    id: 0,
    subDoc: 'none',
    sort: 'none',
    rate: 0,
    score: 0,
    value: 0,
  },
  filter: {
    topRated: false,
    topRecs: false,
    unrated: false,
  },
  artworks: [],
  artists: [],
  stats: {},
};

export const GET_USER = 'user/getUser';
export const SET_USER = 'user/setUser';
export const UPDATE_USER = 'user/updateUser';
export const UPLOAD_FILE = 'user/uploadFile';
export const AUTHENTICATED_USER = 'user/authenticatedUser';
export const GET_USER_TOP_UNRATED_RECS = 'user/getUserTopUnratedRecArtworks';

export const SET_ARTISTS = 'artists/setArtists';
export const GET_ARTISTS = 'artists/getArtists';
export const GET_ARTIST_BY_ID = 'artists/getArtistById';
export const SET_CURSOR_ARTISTS = 'artists/setCursor';

export const SET_ARTWORKS = 'artworks/setArtworks';
export const GET_ARTWORKS = 'artworks/getArtworks';
export const GET_ARTWORK_BY_ID = 'artworks/getArtworkById';
export const SET_CURSOR_ARTWORKS = 'artworks/setCursor';

export const GET_STATS = 'stats/getStats';

export const UPDATE_FILTER_SORT = 'artworks/updateFilterSort';
export const UPDATE_RATING = 'artworks/updateRating';
