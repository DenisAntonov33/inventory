import { createLogger } from "redux-logger";
import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";

import collections from "../utils/api/collections.json";
import { entityQueries } from "../utils/api/index";

import { saga as userSaga } from "./modules/user/saga";
import { reducer as userReducer } from "./modules/user/reducer";

import StoreEntity from "../utils/store-entity";
import * as storeSchema from "../utils/store-schema";

const entities = Object.keys(collections).reduce(
  (acc, key) => {
    const link = collections[key].link;

    const entity = new StoreEntity(
      link,
      storeSchema[link],
      entityQueries[link]
    );

    acc.reducers[link] = entity.reducer;
    acc.sagas = [...acc.sagas, ...entity.saga];
    acc.actions[link] = entity.actions;

    return acc;
  },
  {
    reducers: {},
    sagas: [],
    actions: {},
  }
);

export const actions = entities.actions;

const rootSaga = function* rootSaga() {
  yield all([...userSaga, ...entities.sagas]);
};

const rootReducer = combineReducers({
  user: userReducer,
  data: combineReducers(entities.reducers),
});

const loggerMiddleware = createLogger();
const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  rootReducer,
  applyMiddleware(loggerMiddleware, sagaMiddleware)
);

sagaMiddleware.run(rootSaga);
