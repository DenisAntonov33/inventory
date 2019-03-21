import { takeLatest, put, call } from "redux-saga/effects";
import { currentUserQuery } from "../../graphql";

const READ_CURRENT_USER = "READ_CURRENT_USER";
const READ_CURRENT_USER_LOADING = "READ_CURRENT_USER_LOADING";
const READ_CURRENT_USER_SUCCESS = "READ_CURRENT_USER_SUCCES";
const READ_CURRENT_USER_ERROR = "READ_CURRENT_USER_ERROR";

export const readCurrentUser = () => ({ type: READ_CURRENT_USER });
const loading = () => ({ type: READ_CURRENT_USER_LOADING });
const success = user => ({
  type: READ_CURRENT_USER_SUCCESS,
  payload: { user },
});
const error = err => ({ type: READ_CURRENT_USER_ERROR, err });

export const reducer = (state = {}, action) => {
  switch (action.type) {
    case READ_CURRENT_USER_SUCCESS: {
      const {
        payload: { user },
      } = action;

      return {
        ...state,
        ...user,
      };
    }
    default:
      return state;
  }
};

function* readCurrentUserFetch() {
  loading();
  try {
    const user = yield call(currentUserQuery);
    yield put(success(user));
  } catch (err) {
    yield put(error(err));
  }
}

function* sagaWatcher() {
  yield takeLatest(READ_CURRENT_USER, readCurrentUserFetch);
}

export const saga = [sagaWatcher()];
