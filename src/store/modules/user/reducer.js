import { merge } from "lodash";
import {
  READ_USER_REQUEST,
  READ_USER_SUCCESS,
  READ_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
} from "./actions";

export const reducer = (
  state = {
    data: {},
    error: null,
    isFetching: false,
  },
  { type, payload }
) => {
  switch (type) {
    case READ_USER_REQUEST:
      return merge({}, state, {
        isFetching: true,
      });
    case READ_USER_SUCCESS:
      return merge({}, state, {
        data: { ...payload.user },
        isFetching: false,
      });
    case READ_USER_FAILURE:
      return merge({}, state, {
        error: payload.error,
        isFetching: false,
      });
    case UPDATE_USER_REQUEST:
      return merge({}, state, {
        isFetching: true,
      });
    case UPDATE_USER_SUCCESS:
      return merge({}, state, {
        data: { ...payload.user },
        isFetching: false,
      });
    case UPDATE_USER_FAILURE:
      return merge({}, state, {
        error: payload.error,
        isFetching: false,
      });
    default:
      return state;
  }
};
