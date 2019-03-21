import { combineReducers } from "redux";
import { reducer as currentUserReducer } from "./modules/currentUser";

export default combineReducers({
  currentUser: currentUserReducer,
});
