import * as type from 'Reducer/ReducerType';
import { upsertImageAxios, getImageAxios,
   getTagsAxios } from "Services/API";
import { respCodes } from 'Utils/Config/constants'

export const upsertImage = (formData, access) =>{
  return async(dispatch) => {
    var respCode = "99999"
    var isSuccessUpsertImg = false
    try{
      const resp = await upsertImageAxios(formData, access)
      respCode = resp.data.resp_code
      isSuccessUpsertImg = respCode === respCodes.SUCCESS_REQ
    }catch(error){
      console.log(">>> APIActions.upsertImage.error:", error)
    }

    if(isSuccessUpsertImg){
      dispatch({
        lastRespMsg: respCode,
        type: type.API_UPLOAD_SUCCESS,
      })
    }else{
      dispatch({
        lastRespMsg: respCode,
        type: type.API_UPLOAD_FAIL,
      })
    }

  }
}

// export const updateImage = (formData, access, callbackObj) =>{
//   return async(dispatch) => {
//     var respCode = "99999"
//     var isSuccessUpdateImage = false
//     try{
//       const resp = await uploadImageAxios(formData, access)
//       respCode = resp.data.resp_code
//       isSuccessUpdateImage = respCode === respCodes.SUCCESS_REQ
//     }catch(error){
//       console.log(">>> APIActions.updateImage.error:", error)
//       callbackObj.onFail()
//     }
//
//     if(isSuccessUpdateImage){
//       dispatch({
//         lastRespMsg: respCode,
//         type: type.API_UPLOAD_SUCCESS,
//       })
//     }else{
//       dispatch({
//         lastRespMsg: respCode,
//         type: type.API_UPLOAD_FAIL,
//       })
//     }
//
//   }
// }

export const getImages = (userId, currPage, imgPerPage, tags) =>{
  return async(dispatch) => {
    var respCode = '99999'
    var isSuccessGettingImage = false
    var respData = {}
    try{
      console.log(`>>> APIActions.getImages: userId:${userId}, currPage:${currPage}`)
      const resp = await getImageAxios(userId, currPage, imgPerPage, tags)
      respCode = resp.data.resp_code
      respData = resp.data
      isSuccessGettingImage = respCode === respCodes.SUCCESS_REQ
    }catch(error){
      console.log(">>> APIActions.getImages.error:", error)
    }

    if(isSuccessGettingImage){
      dispatch({
        lastRespMsg: respCode,
        type: type.API_GET_IMAGE_SUCCESS,
        data: respData.data,
        imgCount: respData.img_count,
        numPages: respData.num_pages,
        currPage: respData.curr_page,
      })
    }else{
      dispatch({
        lastRespMsg: respCode,
        type: type.API_GET_IMAGE_FAIL,
      })
    }
  }
}

export const getTags = () =>{
  return async(dispatch) => {
    var respCode = '99999'
    var isSuccessGettingTags = false
    var respData = {}
    try{
      console.log(`>>> APIActions.getTags`)
      const resp = await getTagsAxios()
      respCode = resp.data.resp_code
      respData = resp.data
      isSuccessGettingTags = respCode === respCodes.SUCCESS_REQ
    }catch(error){
      console.log(">>> APIActions.getTags.error:", error)
    }

    if(isSuccessGettingTags){
      dispatch({
        lastRespMsg: respCode,
        type: type.API_GET_TAGS_SUCCESS,
        tags: respData.tags
      })
    }else{
      dispatch({
        lastRespMsg: respCode,
        type: type.API_GET_TAGS_FAIL,
      })
    }
  }
}
