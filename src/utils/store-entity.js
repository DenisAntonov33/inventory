import { mergeWith, cloneDeep } from "lodash";
import { call, put, takeLatest } from "redux-saga/effects";
import { normalize, denormalize } from "normalizr";

const ADD_ENTITIES = "ADD_ENTITIES";

const addEntities = entities => ({
  type: ADD_ENTITIES,
  payload: entities,
});

export default class StoreEntity {
  constructor(collectionLink, schema, queries) {
    const STATE_KEY = collectionLink;

    const { create, readById, readMany, updateById, deleteById } = queries;

    const READ_LIST = `@@${STATE_KEY}/READ_ALL`;
    const CREATE_ITEM = `@@${STATE_KEY}/CREATE}`;
    const READ_BY_ID = `@@${STATE_KEY}/READ_BY_ID`;
    const UPDATE_BY_ID = `@@${STATE_KEY}/UPDATE_BY_ID`;
    const DELETE_BY_ID = `@@${STATE_KEY}/DELETE_BY_ID`;

    const normalizeData = list => normalize(list, [schema]);
    this.selectItem = (id, data) => denormalize(id, schema, data);

    this.actions = {
      readMany: (args = {}) => ({ type: READ_LIST, payload: { args } }),
      create: args => ({ type: CREATE_ITEM, payload: { args } }),
      readById: id => ({ type: READ_BY_ID, payload: { id } }),
      updateById: (id, args) => ({
        type: UPDATE_BY_ID,
        payload: { id, args },
      }),
      deleteById: id => ({ type: DELETE_BY_ID, payload: { id } }),
    };

    this.reducer = (state = { byId: {}, allIds: [] }, { type, payload }) => {
      switch (type) {
        case ADD_ENTITIES: {
          const newState = cloneDeep(state);
          return mergeWith(newState, { byId: payload });
        }
        default:
          return state;
      }
    };

    const itemFetch = request => {
      return function*(action) {
        const { type, payload } = action;

        const successCallback = () => ({
          type: `${type}_SUCCESS`,
        });
        const errorCallback = error => ({
          type: `${type}_ERROR`,
          payload: { error },
        });

        try {
          const { item, items } = yield call(request, payload);
          if (type === DELETE_BY_ID) item.isDeleted = true;

          const { entities } = items
            ? normalizeData(items)
            : normalizeData([item]);

          yield put(successCallback());
          yield put(addEntities(entities));
        } catch (e) {
          yield put(errorCallback(e));
        }
      };
    };

    function* sagaWatcher() {
      yield takeLatest(READ_LIST, itemFetch(readMany));
      yield takeLatest(CREATE_ITEM, itemFetch(create));
      yield takeLatest(READ_BY_ID, itemFetch(readById));
      yield takeLatest(UPDATE_BY_ID, itemFetch(updateById));
      yield takeLatest(DELETE_BY_ID, itemFetch(deleteById));
    }

    this.saga = this.saga = [sagaWatcher()];
  }
}
