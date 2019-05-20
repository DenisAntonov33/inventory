export const SIGNUP_REQUEST = "SIGNUP_REQUEST";
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const READ_USER_REQUEST = "READ_USER_REQUEST";
export const READ_USER_SUCCESS = "READ_USER_SUCCESS";
export const READ_USER_FAILURE = "READ_USER_FAILURE";

export const UPDATE_USER_REQUEST = "UPDATE_USER_REQUEST";
export const UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESS";
export const UPDATE_USER_FAILURE = "UPDATE_USER_FAILURE";

export const LoginRequest = (login, password) => ({
  type: LOGIN_REQUEST,
  payload: { login, password },
});

export const SignupRequest = (name, password, password1) => ({
  type: SIGNUP_REQUEST,
  payload: { name, password, password1 },
});

export const ReadUserRequest = () => ({
  type: READ_USER_REQUEST,
});

export const ReadUserSuccess = user => ({
  type: READ_USER_SUCCESS,
  payload: { user },
});

export const ReadUserFailure = error => ({
  type: READ_USER_FAILURE,
  payload: { error },
});

export const UpdateUserRequest = args => ({
  type: UPDATE_USER_REQUEST,
  payload: { args },
});

export const UpdateUserSuccess = user => ({
  type: UPDATE_USER_SUCCESS,
  payload: { user },
});

export const UpdateUserFailure = error => ({
  type: UPDATE_USER_FAILURE,
  payload: { error },
});
