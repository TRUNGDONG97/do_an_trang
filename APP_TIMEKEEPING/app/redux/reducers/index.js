import { combineReducers } from "redux";
import UserReducer from "./UserReducer";
import ListAbsentReducer from './ListAbsentReducer';
import ListClassReducer from './ListClassReducer';
import ListNotifyReducer from './ListNotifyReducer';
import { RESET } from "../actions/type";
appReducer = combineReducers({
  userReducer: UserReducer,
  listAbsentReducer: ListAbsentReducer,
  listClassReducer: ListClassReducer,
  listNotifyReducer: ListNotifyReducer,
});

const initialState = appReducer({}, {})

export default rootReducer = (state, action) => {
  if (action.type === RESET) {
    state = initialState
  }

  return appReducer(state, action)
}
