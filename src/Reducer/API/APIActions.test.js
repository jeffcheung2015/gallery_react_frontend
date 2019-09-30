import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { respCodes } from 'Utils/Config/constants'
//this mockAxios uses the mocked version in __mocks__ instead of node_modules one
import mockAxios from 'axios';
import * as actions from './APIActions';
import _forEach from 'lodash/forEach';
import * as types from 'Reducer/ReducerType'

let middlewares = [thunk]
let mockStore = configureStore(middlewares)
let initState

let mockAxiosCreate = mockAxios.create({
  baseURL: 'dummyBaseUrl.com',
  timeout: 30000
})

describe("upsertImage", () => {
  describe("send axios request", () => {
    afterEach(() => {
      mockAxios.mockReset()
    })
    it("upsert image to server and database successfully", async ()=>{
      mockAxiosCreate.mockImplementationOnce(() => (
        Promise.resolve({
          data: { resp_code: respCodes.SUCCESS_REQ, }
        })
      ))
      let store = mockStore({ lastRespMsg: "" })
      let expectedActions = [
        { type: types.API_UPLOAD_SUCCESS, lastRespMsg: respCodes.SUCCESS_REQ }
      ]
      return store.dispatch(actions.upsertImage({}, "")).then(() => {
        expect(mockAxiosCreate).toHaveBeenCalledTimes(1);
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
    it("upsert image to server and database unsuccessfully", async ()=>{
      mockAxiosCreate.mockImplementationOnce(() => (
        Promise.reject({
          data: { resp_code: respCodes.UNEXPECTED_SERVER_ERROR, }
        })
      ))
      let store = mockStore({ lastRespMsg: "" })
      let expectedActions = [
        { type: types.API_UPLOAD_FAIL, lastRespMsg: respCodes.UNEXPECTED_SERVER_ERROR }
      ]
      let y=store.dispatch(actions.upsertImage({}, "")).then(() => {
        expect(mockAxiosCreate).toHaveBeenCalledTimes(1);
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })
})


describe("getImages", () => {
  let data, currPage, imgCount, numPages, resp;
  describe("send axios request", () => {
    afterEach(() => {
      mockAxios.mockReset()
    })
    initState = { lastRespMsg: "", imgCount: -1, numPages: -1, currPage: -1, data: [] }
    it("fetch images from database successfully", async ()=>{
      data = [
        { image_file: "/api/cat.jpg", image_name: "cute cats", image_desc: "cats playing", tags: [0,1] },
        { image_file: "/api/dog.jpg", image_name: "cute dog", image_desc: "dog playing", tags: [1] },
      ]
      currPage = 1; numPages = 1; imgCount = 2;
      mockAxiosCreate.mockImplementationOnce(() => (
        Promise.resolve({
          data: {
            resp_code: respCodes.SUCCESS_REQ,
            img_count: imgCount,
            num_pages: numPages,
            curr_page: currPage,
            data: data
          }
        })
      ))
      let store = mockStore(initState)
      let expectedActions = [
        { type: types.API_GET_IMAGE_SUCCESS, lastRespMsg: respCodes.SUCCESS_REQ,
          imgCount, currPage, numPages, data }
      ]
      return store.dispatch(actions.getImages(1, currPage, 12, [], '')).then(() => {
        expect(mockAxiosCreate).toHaveBeenCalledTimes(1);
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
    it("fetch images from database unsuccessfully", async ()=>{
      data = []; imgCount: 0; numPages: 0; currPage: 0;
      mockAxiosCreate.mockImplementationOnce(() => (
        Promise.reject({
          data: {
            resp_code: respCodes.UNEXPECTED_SERVER_ERROR,
            img_count: imgCount,
            num_pages: numPages,
            curr_page: currPage,
            data: [],
          }
        })
      ))
      let store = mockStore(initState)
      let expectedActions = [
        { type: types.API_GET_IMAGE_FAIL, lastRespMsg: respCodes.UNEXPECTED_SERVER_ERROR }
      ]
      return store.dispatch(actions.getImages(1, currPage, 12, [], '')).then(() => {
        expect(mockAxiosCreate).toHaveBeenCalledTimes(1);
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })
})

describe("getTags", () => {
  let dummyTags;
  describe("send axios request", () => {
    afterEach(() => {
      mockAxios.mockReset()
    })
    initState = { lastRespMsg: "", tags: [] }
    it("fetch tags from database successfully", async ()=>{
      dummyTags = ['Zebra', 'Lion']
      mockAxiosCreate.mockImplementationOnce(() => (
        Promise.resolve({
          data: {
            resp_code: respCodes.SUCCESS_REQ,
            tags: dummyTags
          }
        })
      ))
      let store = mockStore(initState)
      let expectedActions = [
        { type: types.API_GET_TAGS_SUCCESS, tags: dummyTags, lastRespMsg: respCodes.SUCCESS_REQ }
      ]
      return store.dispatch(actions.getTags()).then(() => {
        expect(mockAxiosCreate).toHaveBeenCalledTimes(1);
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
    it("fetch tags from database unsuccessfully", async ()=>{
      dummyTags = []
      mockAxiosCreate.mockImplementationOnce(() => (
        Promise.reject({
          data: {
            resp_code: respCodes.UNEXPECTED_SERVER_ERROR,
            tags: dummyTags
          }
        })
      ))
      let store = mockStore(initState)
      let expectedActions = [
        { type: types.API_GET_TAGS_FAIL, lastRespMsg: respCodes.UNEXPECTED_SERVER_ERROR }
      ]
      return store.dispatch(actions.getTags()).then(() => {
        expect(mockAxiosCreate).toHaveBeenCalledTimes(1);
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })
})
