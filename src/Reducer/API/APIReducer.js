import _assign from "lodash/assign";
import * as type from 'Reducer/ReducerType';

const initState = {
  lastRespMsg: "00000",
  data: null,
  imgCount: -1,
  numPages: -1,
  currPage: -1,
  tags:[],
}

export const apiReducer = (state = initState, action) => {
  switch(action.type){
      case type.API_UPLOAD_SUCCESS:
        return _assign({}, state, {
          lastRespMsg: action.lastRespMsg,

        });
      case type.API_UPLOAD_FAIL:
        return _assign({}, state, {
          lastRespMsg: action.lastRespMsg,

        });
      case type.API_GET_IMAGE_SUCCESS:
        return _assign({}, state, {
          lastRespMsg: action.lastRespMsg,
          data: action.data,
          imgCount: action.imgCount,
          numPages: action.numPages,
          currPage: action.currPage,
        });
      case type.API_GET_IMAGE_FAIL:
        return _assign({}, state, {
          lastRespMsg: action.lastRespMsg,
        });
      case type.API_GET_TAGS_SUCCESS:
        return _assign({}, state, {
          lastRespMsg: action.lastRespMsg,
          tags: action.tags,
        });
      case type.API_GET_TAGS_FAIL:
        return _assign({}, state, {
          lastRespMsg: action.lastRespMsg,
          tags: []
        });
      default:
        return state;
  }
}
