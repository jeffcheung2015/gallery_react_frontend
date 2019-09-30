import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

// All Reducers
import { userReducer } from "Reducer/User/UserReducer";
import { uiReducer } from "Reducer/UI/UIReducer";
import { apiReducer } from "Reducer/API/APIReducer";

export const rootReducer = (history) => combineReducers({
  router: connectRouter(history),
  userReducer,
  uiReducer,
  apiReducer
});
