import { createLogger } from "redux-logger";
import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import { intlReducer } from "react-intl-redux";

import { reducer as userReducer } from "./modules/user/reducer";
import { saga as userSaga } from "./modules/user/saga";

import { reducer as requisitionReducer } from "./modules/requisition/reducer";
import { saga as requisitionSaga } from "./modules/requisition/saga";

import { reducer as requisitionStoreReducer } from "./modules/requisition-store/reducer";
import { saga as requisitionStoreSaga } from "./modules/requisition-store/saga";

import { reducer as localesReducer } from "./modules/intl";

import {
  reducer as entityReducer,
  listReducer as entityListReducer,
  sagas as entitySagas,
} from "./modules/entities";

const isTest = process.env.NODE_ENV === "test";

const rootSaga = function* rootSaga() {
  yield all([
    ...userSaga,
    ...requisitionSaga,
    ...requisitionStoreSaga,
    ...entitySagas,
  ]);
};

const rootReducer = combineReducers({
  intl: intlReducer,
  locales: localesReducer,
  user: userReducer,
  data: entityReducer,
  lists: entityListReducer,
  requisition: requisitionReducer,
  requisitionStore: requisitionStoreReducer,
});

const loggerMiddleware = isTest ? () => {} : createLogger();
const sagaMiddleware = createSagaMiddleware();

const middlewares = [];

middlewares.push(sagaMiddleware);
if (!isTest) middlewares.push(loggerMiddleware);

export const store = createStore(rootReducer, applyMiddleware(...middlewares));

sagaMiddleware.run(rootSaga);
