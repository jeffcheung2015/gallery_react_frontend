import _assign from "lodash/assign";
import * as type from 'Reducer/ReducerType';

const initState = {
  isLogin: false,
  userDtlFetched: false,
  lastRespMsg: "",
  access: "",
  refresh: "",
  userId: -1,
  userDetail:{
    username: "",
    email: "",
    createdAt: "",
    lastLoginAt: ""
  },
  userProfile:{
    avatar: "",
    lastProfileEdit: "",
    noOfImgs: 0,
    activity: []
  }
}

export const userReducer = (state = initState, action) => {
  switch (action.type) {
    case type.USER_LOGIN_SUCCESS:
      return _assign({}, state, {
        lastRespMsg: action.lastRespMsg,
        isLogin: true,
        access: action.access,
        refresh: action.refresh,
        userId: action.userId,
        userDetail: action.userDetail,
        userDtlFetched: true,
        userProfile: action.userProfile
      });
    case type.USER_LOGIN_FAIL:
      return _assign({}, state, {
        lastRespMsg: action.lastRespMsg,
        isLogin: false,
        access: "",
        refresh: "",
        userId: -1,
        userDetail: {},
        userDtlFetched: false,
        userProfile: {}
      });
    case type.USER_VERIFY_TOKEN_SUCCESS:
      return _assign({}, state, {
        lastRespMsg: action.lastRespMsg,
        userId: action.userId,
        isLogin: true,
        access: action.access,
        refresh: action.refresh,
      });
    case type.USER_VERIFY_TOKEN_FAIL:
      return _assign({}, state, {
        lastRespMsg: action.lastRespMsg,
        isLogin: false,
        userId: -1,
        access: "",
        refresh: "",
        userDetail: {},
        userDtlFetched: false,
        userProfile: {}
      });
    case type.USER_SIGNUP_SUCCESS:
      return _assign({}, state, {
        lastRespMsg: action.lastRespMsg,
      });
    case type.USER_SIGNUP_FAIL:
      return _assign({}, state, {
        lastRespMsg: action.lastRespMsg,
      });
    case type.GET_USER_SUCCESS:
      return _assign({}, state, {
        lastRespMsg: action.lastRespMsg,
        userDetail: action.userDetail,
        userDtlFetched: true,
        userProfile: action.profile
      });
    case type.GET_USER_FAIL:
      return _assign({}, state, {
        lastRespMsg: action.lastRespMsg,
        userDetail: {},
        userId: -1,
        userDtlFetched: false,
        userProfile: {}
      });
    case type.UPDATE_AVATAR_SUCCESS:
      return _assign({}, state, {
        lastRespMsg: action.lastRespMsg,

      });
    case type.UPDATE_AVATAR_FAIL:
      return _assign({}, state, {
        lastRespMsg: action.lastRespMsg,

      });
    case type.UPDATE_USER_SUCCESS:
      return _assign({}, state, {
        lastRespMsg: action.lastRespMsg,

      });
    case type.UPDATE_USER_FAIL:
      return _assign({}, state, {
        lastRespMsg: action.lastRespMsg,

      });
    case type.USER_LOGOUT:
      return _assign({}, state, {
        lastRespMsg: action.lastRespMsg,
        isLogin: false,
        access: "",
        refresh: "",
        userId: -1,
        userDetail: {},
        userDtlFetched: false,
        userProfile: {}
      });
    default:
      return state;
  }
}
