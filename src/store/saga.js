import { all } from "redux-saga/effects";

import { saga as currentUserSaga } from "./modules/currentUser";

export default function* rootSaga() {
  yield all([...currentUserSaga]);
}
