import _assign from "lodash/assign";
import * as type from 'Reducer/ReducerType';

const initState = {
  isLoading: true,
  isReadyRedirect: false

}

export const uiReducer = (state = initState, action) => {
  switch(action.type){
    case type.UI_START_LOADING:
      return _assign({}, state, {
        isLoading: true
      });
    case type.UI_STOP_LOADING:
      return _assign({}, state, {
        isLoading: false
      });
    default:
      return state;
  }
}
