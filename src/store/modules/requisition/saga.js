import { put, fork, takeLatest, call } from "redux-saga/effects";

import {
  CREATE_REQUISITION_REQUEST,
  CreateRequisitionSuccess,
  CreateRequisitionFailure,
} from "./actions";

import { createRequisitionRequest } from "../../../utils/api";

function* createRequisition() {
  try {
    const { items } = yield call(createRequisitionRequest);
    yield put(CreateRequisitionSuccess(items));
  } catch (err) {
    yield put(CreateRequisitionFailure(err));
  }
}

function* sagaWatcher() {
  yield takeLatest(CREATE_REQUISITION_REQUEST, createRequisition);
}

export const saga = [fork(sagaWatcher)];
