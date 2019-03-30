import { put, fork, takeLatest, call } from "redux-saga/effects";
import { setToken } from "../../../utils/localStorageService";

import {
  READ_USER_REQUEST,
  LOGIN_REQUEST,
  SIGNUP_REQUEST,
  ReadUserFailure,
  ReadUserSuccess,
} from "./actions";

import { signupRequest, loginRequest, meRequest } from "../../../utils/api";

function* login({ payload: { name, password } }) {
  try {
    const { token, user } = yield loginRequest({ name, password });
    setToken(token);
    yield call(() => {
      window.location.replace("/");
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
      window.location.replace("/");
    });
  } catch (error) {
    yield put(ReadUserFailure(error));
  }
}

function* getUser() {
  try {
    const user = yield call(meRequest);
    yield put(ReadUserSuccess(user));
  } catch (err) {
    yield put(ReadUserFailure(err));
  }
}

function* userSagaWatcher() {
  yield takeLatest(READ_USER_REQUEST, getUser);
  yield takeLatest(LOGIN_REQUEST, login);
  yield takeLatest(SIGNUP_REQUEST, signup);
}

export const saga = [fork(userSagaWatcher)];
