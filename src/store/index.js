import { createLogger } from "redux-logger";
import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";

import collections from "../utils/api/collections.json";

import { saga as userSaga } from "./modules/user/saga";
import { reducer as userReducer } from "./modules/user/reducer";

import { ReduxEntity } from "../utils/redux-entity";

let sagas = [...userSaga];

const dataReducers = {};
const listsReducers = {};

Object.keys(collections).forEach(e => {
  const collection = collections[e];
  const entity = new ReduxEntity(collection);

  dataReducers[collection.link] = entity.dataReducer;
  listsReducers[collection.link] = entity.listsReducer;

  // sagas = [...sagas, ...entity.saga];
});

const rootSaga = function* rootSaga() {
  yield all(sagas);
};

const rootReducer = combineReducers({
  user: userReducer,
});

const loggerMiddleware = createLogger();
const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  rootReducer,
  applyMiddleware(loggerMiddleware, sagaMiddleware)
);

sagaMiddleware.run(rootSaga);
