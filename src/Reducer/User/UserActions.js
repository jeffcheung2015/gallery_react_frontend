import * as type from 'Reducer/ReducerType';
import { signup, login, refreshToken, verifyToken,
   logout, getUser, updateUserAxios, updateAvatarAxios } from "Services/Auth";
import jwt from 'jsonwebtoken';
import { respCodes } from 'Utils/Config/constants'

export const userSignup = (username, password, email, recaptchaToken, callbackObj) =>{
  return async(dispatch) => {
    var isSuccessSignup = false
    var respCode = "99999"
    try{
      const resp = await signup({
        username,
        password,
        email,
        recaptchaToken,
      });
      console.log(">>> userSignup resp:" , resp)
      respCode = resp.data.resp_code
      isSuccessSignup = respCode === respCodes.SUCCESS_REQ
    }catch(error){
      console.error(">>> userSignup, error:", error)
    }

    if (isSuccessSignup){
      callbackObj.onSuccess()
      dispatch({
        lastRespMsg: respCode,
        type: type.USER_SIGNUP_SUCCESS,
      })
    }else{
      callbackObj.onFail(respCode)
      dispatch({
        lastRespMsg: respCode,
        type: type.USER_SIGNUP_FAIL,
      })
    }
  }
}
export const userLogin = (username, password, recaptchaToken, callbackObj) => {
  return async (dispatch) => {
    var isSuccessLogin = false
    var respCode = "99999"
    var respData = {}
    var decoded = {}
    try{
      const resp = await login ({
        username,
        password,
        recaptchaToken
      });
      const { access, refresh } = resp.data;
      respData = resp.data
      respCode = resp.data.resp_code
      localStorage.setItem("access", access)
      localStorage.setItem("refresh", refresh)
      decoded = jwt.decode(access)
      console.log(">>> userLogin decoded:", decoded)
      isSuccessLogin = respCode === respCodes.SUCCESS_REQ

    }catch(error){
      console.log(">>> userLogin, error:", error)
    }

    if(isSuccessLogin){
      callbackObj.onSuccess()
      dispatch({
        lastRespMsg: respCode,
        type: type.USER_LOGIN_SUCCESS,
        userId: decoded.user_id,
        access: respData.access,
        refresh: respData.refresh,
        userDetail:{
          username: respData.username,
          email: respData.email,
          createdAt: respData.date_joined,
          lastLoginAt: respData.last_login
        },
        userProfile:{
          avatar: respData.avatar,
          lastProfileEdit: respData.last_edit,
          noOfImgs: respData.no_of_imgs
        }
      });
    }else{
      callbackObj.onFail(respCode)
      dispatch({
        lastRespMsg: respCode,
        type: type.USER_LOGIN_FAIL,
      })
    }
  }
}

export const verifyJWTToken = (access, refresh) => {
  return async (dispatch) => {
    var isSuccessVerify = false
    var newAccess = "";
    if (access && refresh){
      try{
        const accessResp = await verifyToken(access);
        console.log(">>> verifyJWTToken accessResp:", accessResp)
        isSuccessVerify = true
      }catch(error){
        console.log(">>> verifyJWTToken access token invalid:", error)
        try{
          const refreshResp = await verifyToken(refresh);
          console.log(">>> verifyJWTToken refreshResp: ", refreshResp)
          const resp = await refreshToken({refresh})
          console.log(">>> refreshToken resp: ", resp)
          newAccess = resp.data.access;
          localStorage.setItem("access", newAccess)
          isSuccessVerify = true
        }catch(error){
          console.error(">>>verifyJWTToken refresh token invalid:", error)
        }
      }
    }
    // invalid jwt token issue occurs
    if(isSuccessVerify) {
      // have to manually do it as integreting the resp_msg into verify api in backend is too tedious
      var tmpAccess = newAccess || access
      let decoded = jwt.decode(tmpAccess)
      console.log(">>> verifyJWTToken decode jwt:", decoded)
      dispatch({
        lastRespMsg: "00000",
        type: type.USER_VERIFY_TOKEN_SUCCESS,
        userId: decoded.user_id,
        access: tmpAccess,
      });
    } else {
      dispatch({
        lastRespMsg: "99999",
        type: type.USER_VERIFY_TOKEN_FAIL,
      });
    }
  }
}

export const getAuthUser = (access) => {

  return async (dispatch) => {
    var isSuccessGettingUser = false
    var respCode = "99999"
    var respData = {}
    try{
      const resp = await getUser(access);
      respData = resp.data
      respCode = resp.data.resp_code
      console.log(">>> getAuthUser: ", resp.data)
      isSuccessGettingUser = respCode === respCodes.SUCCESS_REQ
    }catch(error){
      console.error(">>> getAuthUser, error:", error)
    }

    if(isSuccessGettingUser){
      dispatch({
        lastRespMsg: respCode,
        type: type.GET_USER_SUCCESS,
        userDetail: {
          username: respData.username,
          email: respData.email,
          createdAt: respData.date_joined,
          lastLoginAt: respData.last_login,
        },
        userProfile: {
          avatar: respData.avatar,
          lastProfileEdit: respData.last_edit,
          noOfImgs: respData.no_of_imgs,
          activity: respData.activity
        }
      });
    }else{
      dispatch({
        lastRespMsg: respCode,
        type: type.GET_USER_FAIL,
      });
    }
  }
}

export const updateAvatar = (formData, access, callbackObj) =>{
  return async(dispatch) => {
    var isSuccessUpdateAvatar = false
    var respCode = "99999"
    var respData = {}
    try{
      const resp = await updateAvatarAxios(formData, access)

      respCode = resp.data.resp_code
      isSuccessUpdateAvatar = resp.data.resp_code === respCodes.SUCCESS_REQ

    }catch(error){
      console.log(">>> APIActions.updateAvatar.error:", error)
    }

    if (isSuccessUpdateAvatar){
      callbackObj.onSuccess()
      dispatch({
        lastRespMsg: respCode,
        type: type.UPDATE_AVATAR_SUCCESS,
      })
    }else{
      callbackObj.onFail(respCode)
      dispatch({
        lastRespMsg: respCode,
        type: type.UPDATE_AVATAR_FAIL,
      })
    }
  }
}

export const updateUser = (formData, access, callbackObj) =>{
  return async(dispatch) => {
    var isSuccessUpdateUser = false
    var respCode = "99999"
    var respData = {}
    try{
      const resp = await updateUserAxios(formData, access)

      respCode = resp.data.resp_code
      isSuccessUpdateUser = respCode === respCodes.SUCCESS_REQ
    }catch(error){
      console.log(">>> APIActions.updateUser.error:", error)
    }

    if (isSuccessUpdateUser){
      callbackObj.onSuccess()
      dispatch({
        lastRespMsg: respCode,
        type: type.UPDATE_USER_SUCCESS,
      })
    }else{
      callbackObj.onFail(respCode)
      dispatch({
        lastRespMsg: respCode,
        type: type.UPDATE_USER_FAIL,
      })
    }
  }
}

export const userLogout = () => {
  return async (dispatch) => {
    const resp = await logout();
    localStorage.clear()
    dispatch({
      lastRespMsg: '00000',
      type: type.USER_LOGOUT,
    });
  }
}
