import { mergeWith, cloneDeep, union } from "lodash";
import { call, put, takeLatest } from "redux-saga/effects";
import { normalize, denormalize } from "normalizr";

const ADD_ENTITIES = "ADD_ENTITIES";
const ADD_ENTITIES_LIST = "ADD_ENTITIES_LIST";

const addEntities = entities => ({
  type: ADD_ENTITIES,
  payload: entities,
});

const addEntityList = list => ({
  type: ADD_ENTITIES_LIST,
  payload: list,
});

export default class StoreEntity {
  constructor(collectionLink, schema, queries) {
    const STATE_KEY = collectionLink;

    const { create, readById, readMany, updateById, deleteById } = queries;

    const READ_MANY = `@@${STATE_KEY}/READ_MANY`;
    const CREATE = `@@${STATE_KEY}/CREATE`;
    const READ_BY_ID = `@@${STATE_KEY}/READ_BY_ID`;
    const UPDATE_BY_ID = `@@${STATE_KEY}/UPDATE_BY_ID`;
    const DELETE_BY_ID = `@@${STATE_KEY}/DELETE_BY_ID`;

    const normalizeData = list => normalize(list, [schema]);

    this.selectors = {
      getItemById: (id, data) => denormalize(id, schema, data),
      getItems: (ids, data) => denormalize(ids, [schema], data),
    };

    this.actions = {
      readMany: (args = {}) => ({ type: READ_MANY, payload: { args } }),
      create: args => ({ type: CREATE, payload: { args } }),
      readById: id => ({ type: READ_BY_ID, payload: { id } }),
      updateById: (id, args) => ({
        type: UPDATE_BY_ID,
        payload: { id, args },
      }),
      deleteById: id => ({ type: DELETE_BY_ID, payload: { id } }),
    };

    this.reducer = (state = {}, action) => {
      switch (action.type) {
        case ADD_ENTITIES: {
          const newState = cloneDeep(state);
          return mergeWith(
            newState,
            action.payload[STATE_KEY],
            (objValue, srcValue) => {
              if (!objValue) return srcValue;
              return objValue.updatedAt > srcValue.updatedAt
                ? objValue
                : srcValue;
            }
          );
        }
        default:
          return state;
      }
    };

    this.listReducer = (state = [], action) => {
      switch (action.type) {
        case ADD_ENTITIES_LIST: {
          return union(state, action.payload[STATE_KEY]);
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

          const { entities, result } = items
            ? normalizeData(items)
            : normalizeData([item]);

          yield put(successCallback());

          yield put(addEntities(entities));
          yield put(addEntityList({ [STATE_KEY]: result }));
        } catch (e) {
          yield put(errorCallback(e));
        }
      };
    };

    function* sagaWatcher() {
      yield takeLatest(READ_MANY, itemFetch(readMany));
      yield takeLatest(CREATE, itemFetch(create));
      yield takeLatest(READ_BY_ID, itemFetch(readById));
      yield takeLatest(UPDATE_BY_ID, itemFetch(updateById));
      yield takeLatest(DELETE_BY_ID, itemFetch(deleteById));
    }

    this.saga = [sagaWatcher()];
  }
}
