import { combineReducers } from "redux";

import { collections, entityQueries } from "../../utils/api";
import StoreEntity from "../../utils/store-entity";
import storeSchema from "../../utils/store-schema";

const entities = collections.reduce(
  (acc, collection) => {
    const link = collection;

    const entity = new StoreEntity(
      link,
      storeSchema[link],
      entityQueries[link]
    );

    acc.reducers[link] = entity.reducer;
    acc.listReducers[link] = entity.listReducer;
    acc.sagas = [...acc.sagas, ...entity.saga];
    acc.actions[link] = entity.actions;
    acc.selectors[link] = entity.selectors;

    return acc;
  },
  {
    reducers: {},
    listReducers: {},
    sagas: [],
    actions: {},
    selectors: {},
  }
);

export const actions = entities.actions;
export const sagas = entities.sagas;
export const selectors = entities.selectors;
export const reducer = combineReducers(entities.reducers);
export const listReducer = combineReducers(entities.listReducers);
