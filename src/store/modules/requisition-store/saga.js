import { put, fork, takeLatest, call } from "redux-saga/effects";

import {
  CREATE_REQUISITION_STORE_REQUEST,
  CreateRequisitionStoreSuccess,
  CreateRequisitionStoreFailure,
} from "./actions";

import { createRequisitionStoreRequest } from "../../../utils/api";

function* createRequisitionStore() {
  try {
    const { items } = yield call(createRequisitionStoreRequest);
    yield put(
      CreateRequisitionStoreSuccess(
        items.map(e => {
          e.nessesaryCount = e.count;
          e.count = 0;
          return e;
        })
      )
    );
  } catch (err) {
    yield put(CreateRequisitionStoreFailure(err));
  }
}

function* sagaWatcher() {
  yield takeLatest(CREATE_REQUISITION_STORE_REQUEST, createRequisitionStore);
}

export const saga = [fork(sagaWatcher)];
