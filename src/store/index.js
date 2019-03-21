import { createLogger } from "redux-logger";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";

import rootReducer from "./reducer";
import rootSaga from "./saga";

const loggerMiddleware = createLogger();
const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  rootReducer,
  applyMiddleware(loggerMiddleware, sagaMiddleware)
);
sagaMiddleware.run(rootSaga);
