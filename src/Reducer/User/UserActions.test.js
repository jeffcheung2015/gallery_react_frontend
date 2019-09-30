import configureStore from 'redux-mock-store'
import { respCodes } from 'Utils/Config/constants'
//this mockAxios uses the mocked version in __mocks__ instead of node_modules one
import thunk from 'redux-thunk'
import mockAxios from 'axios';
import * as actions from './UserActions';
import _forEach from 'lodash/forEach';
import * as types from 'Reducer/ReducerType'
import jwt from 'jsonwebtoken';

let middlewares = [thunk]
let mockStore = configureStore(middlewares)
let initState = {}

let mockAxiosCreate = mockAxios.create({
  baseURL: 'dummyBaseUrl.com',
  timeout: 30000
})

let dummyAccess = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSJ9.O5Y5s_hvEW8BM7E8jq6HihxQ0DDFxO_2_xtnrvVj4PY'
let dummyRefresh = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSIsInJlZnJlc2giOnRydWV9.4CSlFN24SjdSfvCb5U7rfO-RGrdd_709IlIUkCQMlpg'
let userId = '1';
let username = "iamuser";
let email = "iamuser@gamil.com";
let date_joined = "2018-06-12 09:55:22";
let last_login = "2018-06-12 10:55:22";
let last_edit = "2018-06-12 10:56:22";
let avatar = "/api/default.jpeg";
let no_of_imgs = 2;
let activity = ["2018-06-12 10:36:22",  "2018-06-12 10:56:22"];

describe("userSignup", () => {
  describe("send axios request", () => {
    afterEach(() => {
      mockAxios.mockReset()
    })
    initState = { lastRespMsg: "" }
    it("signup and store user info into database successfully", async ()=>{
      mockAxiosCreate.mockImplementationOnce(() => (
        Promise.resolve({
          data: { resp_code: respCodes.SUCCESS_REQ, }
        })
      ))
      let store = mockStore(initState)
      let expectedActions = [
        { type: types.USER_SIGNUP_SUCCESS, lastRespMsg: respCodes.SUCCESS_REQ }
      ]
      return store.dispatch(actions.userSignup('','','','',
      {onSuccess: jest.fn(), onFail: jest.fn()})).then(() => {
        expect(mockAxiosCreate).toHaveBeenCalledTimes(1);
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
    it("signup and store user info into database unsuccessfully", async ()=>{
      mockAxiosCreate.mockImplementationOnce(() => (
        Promise.reject({
          data: { resp_code: respCodes.UNEXPECTED_SERVER_ERROR, }
        })
      ))
      let store = mockStore(initState)
      let expectedActions = [
        { type: types.USER_SIGNUP_FAIL, lastRespMsg: respCodes.UNEXPECTED_SERVER_ERROR }
      ]
      return store.dispatch(actions.userSignup('','','','',
      {onSuccess: jest.fn(), onFail: jest.fn()})).then(() => {
        expect(mockAxiosCreate).toHaveBeenCalledTimes(1);
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })
})


describe("userLogin", () => {
  describe("send axios request", () => {
    afterEach(() => {
      mockAxios.mockReset()
    })
    initState = { lastRespMsg: "", access: "", refresh: "", userId: -1,
      userDetail:{ username: "", email: "", createdAt: "", lastLoginAt: "" },
      userProfile:{ avatar: "", lastProfileEdit: "", noOfImgs: 0, }
    }
    it("login successfully", async ()=>{
      mockAxiosCreate.mockImplementationOnce(() => (
        Promise.resolve({
          data: {
            resp_code: respCodes.SUCCESS_REQ,
            userId, access: dummyAccess, refresh: dummyRefresh, username, email, date_joined, last_login,
            avatar, last_edit, no_of_imgs
          }
        })
      ))
      let store = mockStore(initState)
      let expectedActions = [
        { type: types.USER_LOGIN_SUCCESS, lastRespMsg: respCodes.SUCCESS_REQ,
          userId,
          access: dummyAccess, refresh: dummyRefresh,
          userDetail: {
            username, email, createdAt: date_joined, lastLoginAt: last_login
          },
          userProfile: {
            avatar, lastProfileEdit: last_edit, noOfImgs: no_of_imgs
          }
        }
      ]
      return store.dispatch(actions.userLogin('','','',
      {onSuccess: jest.fn(), onFail: jest.fn()})).then(() => {
        expect(mockAxiosCreate).toHaveBeenCalledTimes(1);
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
    it("login unsuccessfully", async ()=>{
      mockAxiosCreate.mockImplementationOnce(() => (
        Promise.reject({
          data: { resp_code: respCodes.UNEXPECTED_SERVER_ERROR, }
        })
      ))
      let store = mockStore(initState)
      let expectedActions = [
        { type: types.USER_LOGIN_FAIL, lastRespMsg: respCodes.UNEXPECTED_SERVER_ERROR }
      ]
      return store.dispatch(actions.userLogin('','','',
      {onSuccess: jest.fn(), onFail: jest.fn()})).then(() => {
        expect(mockAxiosCreate).toHaveBeenCalledTimes(1);
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })
})


describe("verifyJWTToken", () => {
  describe("send axios request", () => {
    afterEach(() => {
      mockAxios.mockReset()
    })
    initState = { lastRespMsg: "", userId: -1, access: "" }
    it("verify JWt token successfully with access token only", async ()=>{
      mockAxiosCreate.mockImplementationOnce(() => (
        Promise.resolve({
          data: { resp_code: respCodes.SUCCESS_REQ }
        })
      ))
      let store = mockStore(initState)
      let expectedActions = [
        { type: types.USER_VERIFY_TOKEN_SUCCESS, lastRespMsg: respCodes.SUCCESS_REQ,
          userId: "1", access: dummyAccess
        }
      ]
      return store.dispatch(actions.verifyJWTToken(dummyAccess,dummyRefresh)).then(() => {
        expect(mockAxiosCreate).toHaveBeenCalledTimes(1);
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    describe("access token expired or invalid", () => {
      it("refresh token still valid and verified successfully", async ()=>{
        let newDummyAccess = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSIsInJlZnJlc2hfZGF0ZSI6IjAzIE1hciAyMDE5In0.JNEydoH244A4JiUDfh5jHiekvWCA9oH2bgzTSI8Xqe8"
        mockAxiosCreate.mockImplementationOnce(() => ( //invalid access token - expired
          Promise.reject({
            data: { resp_code: respCodes.UNEXPECTED_SERVER_ERROR, }
          })
        )).mockImplementationOnce(() => ( //valid refresh token
          Promise.resolve({
            data: { resp_code: respCodes.SUCCESS_REQ }
          })
        )).mockImplementationOnce(() => ( //refresh token successfully
          Promise.resolve({
            data: { resp_code: respCodes.SUCCESS_REQ, access: newDummyAccess }
          })
        ))
        let store = mockStore(initState)
        let expectedActions = [
          { type: types.USER_VERIFY_TOKEN_SUCCESS, lastRespMsg: respCodes.SUCCESS_REQ,
             userId: "1", access: newDummyAccess }
        ]
        return store.dispatch(actions.verifyJWTToken(dummyAccess, dummyRefresh)).then(() => {
          expect(mockAxiosCreate).toHaveBeenCalledTimes(3);
          expect(store.getActions()).toEqual(expectedActions)
        })
      })

      it("refresh token is also invalid and hence unsuccessfull verification", async ()=>{
        mockAxiosCreate.mockImplementation(() => (
          Promise.reject({
            data: { resp_code: respCodes.UNEXPECTED_SERVER_ERROR, }
          })
        ))
        let store = mockStore(initState)
        let expectedActions = [
          { type: types.USER_VERIFY_TOKEN_FAIL, lastRespMsg: respCodes.UNEXPECTED_SERVER_ERROR }
        ]
        return store.dispatch(actions.verifyJWTToken(dummyAccess, dummyRefresh)).then(() => {
          expect(mockAxiosCreate).toHaveBeenCalledTimes(2);
          expect(store.getActions()).toEqual(expectedActions)
        })
      })
    })
  })
})

describe("getAuthUser", () => {
  describe("send axios request", () => {
    afterEach(() => {
      mockAxios.mockReset()
    })
    initState = { lastRespMsg: "" }
    it("user exists and get user from database successfully", async ()=>{
      mockAxiosCreate.mockImplementationOnce(() => (
        Promise.resolve({
          data: { resp_code: respCodes.SUCCESS_REQ,
            username, email, date_joined, last_login, avatar,
            last_edit, no_of_imgs, activity
          }
        })
      ))
      let store = mockStore(initState)
      let expectedActions = [
        { type: types.GET_USER_SUCCESS, lastRespMsg: respCodes.SUCCESS_REQ,
          userDetail:{
            username, email, createdAt: date_joined, lastLoginAt: last_login,
          },
          userProfile: {
            avatar, lastProfileEdit: last_edit, noOfImgs: no_of_imgs, activity
          }
        }
      ]
      return store.dispatch(actions.getAuthUser(dummyAccess)).then(() => {
        expect(mockAxiosCreate).toHaveBeenCalledTimes(1);
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
    it("user doesn't exist or fetch from database unsuccessfully", async ()=>{
      mockAxiosCreate.mockImplementationOnce(() => (
        Promise.reject({
          data: { resp_code: respCodes.UNEXPECTED_SERVER_ERROR, }
        })
      ))
      let store = mockStore(initState)
      let expectedActions = [
        { type: types.GET_USER_FAIL, lastRespMsg: respCodes.UNEXPECTED_SERVER_ERROR }
      ]
      return store.dispatch(actions.getAuthUser(dummyAccess)).then(() => {
        expect(mockAxiosCreate).toHaveBeenCalledTimes(1);
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })
})


describe("updateAvatar", () => {
  describe("send axios request", () => {
    afterEach(() => {
      mockAxios.mockReset()
    })
    initState = { lastRespMsg: "" }
    it("update user avatar successfully", async ()=>{
      mockAxiosCreate.mockImplementationOnce(() => (
        Promise.resolve({
          data: { resp_code: respCodes.SUCCESS_REQ, }
        })
      ))
      let store = mockStore(initState)
      let expectedActions = [
        { type: types.UPDATE_AVATAR_SUCCESS, lastRespMsg: respCodes.SUCCESS_REQ, }
      ]
      return store.dispatch(actions.updateAvatar({}, dummyAccess,
         {onSuccess: jest.fn(), onFail: jest.fn()})).then(() => {
        expect(mockAxiosCreate).toHaveBeenCalledTimes(1);
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
    it("update user avatar unsuccessfully", async ()=>{
      mockAxiosCreate.mockImplementationOnce(() => (
        Promise.reject({
          data: { resp_code: respCodes.UNEXPECTED_SERVER_ERROR, }
        })
      ))
      let store = mockStore(initState)
      let expectedActions = [
        { type: types.UPDATE_AVATAR_FAIL, lastRespMsg: respCodes.UNEXPECTED_SERVER_ERROR }
      ]
      return store.dispatch(actions.updateAvatar({}, dummyAccess,
         {onSuccess: jest.fn(), onFail: jest.fn()})).then(() => {
        expect(mockAxiosCreate).toHaveBeenCalledTimes(1);
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })
})


describe("updateUser", () => {
  describe("send axios request", () => {
    afterEach(() => {
      mockAxios.mockReset()
    })
    initState = { lastRespMsg: "" }
    it("update user info successfully", async ()=>{
      mockAxiosCreate.mockImplementationOnce(() => (
        Promise.resolve({
          data: { resp_code: respCodes.SUCCESS_REQ, }
        })
      ))
      let store = mockStore(initState)
      let expectedActions = [
        { type: types.UPDATE_USER_SUCCESS, lastRespMsg: respCodes.SUCCESS_REQ, }
      ]
      return store.dispatch(actions.updateUser({}, dummyAccess,
         {onSuccess: jest.fn(), onFail: jest.fn()})).then(() => {
        expect(mockAxiosCreate).toHaveBeenCalledTimes(1);
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
    it("update user info unsuccessfully", async ()=>{
      mockAxiosCreate.mockImplementationOnce(() => (
        Promise.reject({
          data: { resp_code: respCodes.UNEXPECTED_SERVER_ERROR, }
        })
      ))
      let store = mockStore(initState)
      let expectedActions = [
        { type: types.UPDATE_USER_FAIL, lastRespMsg: respCodes.UNEXPECTED_SERVER_ERROR }
      ]
      return store.dispatch(actions.updateUser({}, dummyAccess,
         {onSuccess: jest.fn(), onFail: jest.fn()})).then(() => {
        expect(mockAxiosCreate).toHaveBeenCalledTimes(1);
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })
})


describe("logout", () => {
  describe("send axios request", () => {
    afterEach(() => {
      mockAxios.mockReset()
    })
    initState = { lastRespMsg: "" }
    it("logout user successfully", async ()=>{
      mockAxiosCreate.mockImplementationOnce(() => (
        Promise.resolve({
          data: { resp_code: respCodes.SUCCESS_REQ, }
        })
      ))
      let store = mockStore(initState)
      let expectedActions = [
        { type: types.USER_LOGOUT, lastRespMsg: respCodes.SUCCESS_REQ, }
      ]
      return store.dispatch(actions.userLogout()).then(() => {
        expect(mockAxiosCreate).toHaveBeenCalledTimes(1);
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })
})
