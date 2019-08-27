import * as type from 'Reducer/ReducerType';

export function startLoading(){
  return { type: type.UI_START_LOADING }
}

export function stopLoading(){
  return { type: type.UI_STOP_LOADING }
}
