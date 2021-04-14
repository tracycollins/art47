import { put, call, takeLeading } from 'redux-saga/effects';
import request from 'utils/request';
// import { selectStats } from './selectors';
// import { Stats } from 'types/Stats';
import { GET_STATS } from 'app/constants';
import { statsActions as actions } from '.';

const developmentAppApiUrl =
  process.env.LOCAL_APP_API_URL || 'http://localhost:3001';
const productionAppApiUrl = process.env.REACT_APP_API_URL || false;

const API_ROOT = productionAppApiUrl || developmentAppApiUrl;

export function* getStats() {
  try {
    const requestURL = `${API_ROOT}/stats/`;
    console.log(`SAGA | getStats | ${requestURL}`);

    const { stats } = yield call(request, requestURL);
    console.log(`SAGA | getStats | STATS`);
    console.log({ stats });
    yield put(actions.setStats(stats));
    yield put(actions.statsLoaded(stats));
  } catch (err) {
    console.error(err);
    yield put(actions.statsError(err));
  }
}

export function* statsSaga() {
  yield takeLeading(GET_STATS, getStats);
}
