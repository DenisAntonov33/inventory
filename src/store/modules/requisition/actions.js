export const CREATE_REQUISITION_REQUEST = "CREATE_REQUISITION_REQUEST";
export const CREATE_REQUISITION_SUCCESS = "CREATE_REQUISITION_SUCCESS";
export const CREATE_REQUISITION_FAILURE = "CREATE_REQUISITION_FAILURE";

export const CreateRequisitionRequest = () => ({
  type: CREATE_REQUISITION_REQUEST,
});

export const CreateRequisitionSuccess = items => ({
  type: CREATE_REQUISITION_SUCCESS,
  payload: { items },
});

export const CreateRequisitionFailure = error => ({
  type: CREATE_REQUISITION_FAILURE,
  payload: { error },
});
