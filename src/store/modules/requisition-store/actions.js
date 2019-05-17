export const CREATE_REQUISITION_STORE_REQUEST =
  "CREATE_REQUISITION_STORE_REQUEST";
export const CREATE_REQUISITION_STORE_SUCCESS =
  "CREATE_REQUISITION_STORE_SUCCESS";
export const CREATE_REQUISITION_STORE_FAILURE =
  "CREATE_REQUISITION_STORE_FAILURE";

export const CreateRequisitionStoreRequest = () => ({
  type: CREATE_REQUISITION_STORE_REQUEST,
});

export const CreateRequisitionStoreSuccess = items => ({
  type: CREATE_REQUISITION_STORE_SUCCESS,
  payload: { items },
});

export const CreateRequisitionStoreFailure = error => ({
  type: CREATE_REQUISITION_STORE_FAILURE,
  payload: { error },
});
