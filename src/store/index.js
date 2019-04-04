import { createLogger } from "redux-logger";
import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";

import { reducer as userReducer } from "./modules/user/reducer";
import { saga as userSaga } from "./modules/user/saga";

import {
  reducer as entityReducer,
  listReducer as entityListReducer,
  sagas as entitySagas,
} from "./modules/entities";

const isTest = process.env.NODE_ENV === "test";

const rootSaga = function* rootSaga() {
  yield all([...userSaga, ...entitySagas]);
};

const rootReducer = combineReducers({
  user: userReducer,
  data: entityReducer,
  lists: entityListReducer,
});

const loggerMiddleware = isTest ? () => {} : createLogger();
const sagaMiddleware = createSagaMiddleware();

const middlewares = [];

middlewares.push(sagaMiddleware);
if (!isTest) middlewares.push(loggerMiddleware);

export const store = createStore(rootReducer, applyMiddleware(...middlewares));

sagaMiddleware.run(rootSaga);
