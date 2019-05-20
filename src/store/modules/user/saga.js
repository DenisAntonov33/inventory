import { put, fork, takeLatest, call } from "redux-saga/effects";
import { setToken } from "../../../utils/localStorageService";
import history from "../../../utils/history";

import {
  READ_USER_REQUEST,
  LOGIN_REQUEST,
  SIGNUP_REQUEST,
  UPDATE_USER_REQUEST,
  ReadUserFailure,
  ReadUserSuccess,
  UpdateUserFailure,
  UpdateUserSuccess,
} from "./actions";

import {
  signupRequest,
  loginRequest,
  meRequest,
  updateUserRequest,
} from "../../../utils/api";

function* login({ payload: { name, password } }) {
  try {
    const { token, user } = yield loginRequest({ name, password });
    setToken(token);
    yield call(() => {
      history.replace("/");
    });
    yield put(ReadUserSuccess(user));
  } catch (error) {
    yield put(ReadUserFailure(error));
  }
}

function* signup({ payload: { name, password, password1 } }) {
  try {
    const { token, user } = yield signupRequest({ name, password, password1 });
    setToken(token);

    yield put(ReadUserSuccess(user));
    yield call(() => {
      history.replace("/");
    });
  } catch (error) {
    yield put(ReadUserFailure(error));
  }
}

function* getUser() {
  try {
    const { user } = yield call(meRequest);
    yield put(ReadUserSuccess(user));
  } catch (err) {
    yield put(ReadUserFailure(err));
  }
}

function* updateUser({ payload }) {
  try {
    const { item } = yield updateUserRequest(payload);
    yield put(UpdateUserSuccess(item));
  } catch (err) {
    yield put(UpdateUserFailure(err));
  }
}

function* userSagaWatcher() {
  yield takeLatest(READ_USER_REQUEST, getUser);
  yield takeLatest(LOGIN_REQUEST, login);
  yield takeLatest(SIGNUP_REQUEST, signup);
  yield takeLatest(UPDATE_USER_REQUEST, updateUser);
}

export const saga = [fork(userSagaWatcher)];
