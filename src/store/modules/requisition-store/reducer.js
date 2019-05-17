import { merge, cloneDeep } from "lodash";

import {
  CREATE_REQUISITION_STORE_REQUEST,
  CREATE_REQUISITION_STORE_SUCCESS,
  CREATE_REQUISITION_STORE_FAILURE,
} from "./actions";

export const reducer = (
  state = {
    data: [],
    error: null,
    isFetching: false,
  },
  { type, payload }
) => {
  switch (type) {
    case CREATE_REQUISITION_STORE_REQUEST:
      return merge(cloneDeep(state), {
        isFetching: true,
      });
    case CREATE_REQUISITION_STORE_SUCCESS: {
      return merge(cloneDeep(state), {
        data: [...payload.items],
        isFetching: false,
      });
    }
    case CREATE_REQUISITION_STORE_FAILURE:
      return merge(cloneDeep(state), {
        error: payload.error,
        isFetching: false,
      });
    default:
      return state;
  }
};
