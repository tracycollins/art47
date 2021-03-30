import { put, call, select, takeLeading, delay } from 'redux-saga/effects';
// import { userActions as actions } from '.';
import request from 'utils/request';
import { selectUser } from './selectors';
import { User } from 'types/User';
import { GET_USER } from 'app/constants';
import { userActions as actions } from '.';

// console.log({ actions });

const developmentAppApiUrl =
  process.env.LOCAL_APP_API_URL || 'http://localhost:3001';
const productionAppApiUrl = process.env.REACT_APP_API_URL || false;

const API_ROOT = productionAppApiUrl || developmentAppApiUrl;

export function* getUser() {
  console.log(`getUser | API_ROOT: ${API_ROOT}`);
  try {
    yield delay(500);

    const user: User = yield select(selectUser);

    console.log({ user });
    const userid = user.id || user.sub;

    const requestURL = `${API_ROOT}/users/${userid}/`;

    console.log({ requestURL });
    const results = yield call(request, requestURL);

    console.log({ results });
    yield put(actions.setUser(results.user));
  } catch (err) {
    console.error(err);
  }
}
export function* userSaga() {
  yield takeLeading(GET_USER, getUser);
}
