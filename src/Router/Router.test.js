import React, { Component } from 'react'

import { MemoryRouter } from 'react-router'
import App from 'App'
import Router from './index'

import { Provider } from 'react-redux'
import { store } from 'Reducer/StoreConfig'
import { SnackbarProvider } from 'notistack';
import * as types from 'Reducer/ReducerType';
import RippleDropzoneArea from 'Components/UI/RippleDropzoneArea'

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import _set from 'lodash/set'
// import _times from 'lodash/times'
import _forEach from 'lodash/forEach'
import _cloneDeep from 'lodash/cloneDeep'

const middlewares = [thunk]
const mockStoreWithMiddlewares = configureStore(middlewares)

let wrapper

let routerHistory

// let [verifyJWTToken, getAuthUser, startLoading, stopLoading] = _times(4, () => jest.fn())
// let funcProps = {verifyJWTToken, getAuthUser, startLoading, stopLoading}

describe("<Router />", () => {
  describe("user is logged in", () => {
    let initialState, mockStore
    beforeAll(() => {
      // get the real initial state format from the existing store
      initialState = _cloneDeep(store.getState())
      _set(initialState, 'userReducer.isLogin', true)
      // using the obtained initialState to mock a real store
      mockStore = mockStoreWithMiddlewares(initialState)
      // console.info(wrapper.props().children.props.children)
    })

    let urlComponentMap = [
      {testUrl: '', expect: 'HomePageContainer'},
      {testUrl: 'login', expect: 'ProfilePageContainer'},
      {testUrl: 'signup', expect: 'ProfilePageContainer'},
      {testUrl: 'profile', expect: 'ProfilePageContainer'},
      {testUrl: 'upload', expect: 'UploadPageContainer'},
      {testUrl: '404', expect: 'NotFoundPage'},
    ]
    _forEach(urlComponentMap, (elem, idx) => {
      it("testUrl: /" + elem.testUrl, () => {
        wrapper = mount(
          <Provider store={mockStore}>
            <SnackbarProvider>
              <MemoryRouter initialEntries={[`/${elem.testUrl}`]} initialIndex={0}>
                <Router
                />
              </MemoryRouter>
            </SnackbarProvider>
          </Provider>
        )
        // console.info(`/${elem.testUrl}`, wrapper.html())
        expect(wrapper.find(elem.expect)).toHaveLength(1)
      })
    })
  })

  describe("user is not logged in", () => {
    let initialState, mockStore
    beforeAll(() => {
      // get the real initial state format from the existing store
      initialState = _cloneDeep(store.getState())
      _set(initialState, 'userReducer.isLogin', false)
      // using the obtained initialState to mock a real store
      mockStore = mockStoreWithMiddlewares(initialState)
      // console.info(wrapper.props().children.props.children)
    })

    let urlComponentMap = [
      {testUrl: '', expect: 'HomePageContainer'},
      {testUrl: 'login', expect: 'LoginPageContainer'},
      {testUrl: 'signup', expect: 'SignupPageContainer'},
      {testUrl: 'profile', expect: 'LoginPageContainer'},
      {testUrl: 'upload', expect: 'LoginPageContainer'},
      {testUrl: '404', expect: 'NotFoundPage'},
    ]
    _forEach(urlComponentMap, (elem, idx) => {
      it("testUrl: /" + elem.testUrl, () => {
        wrapper = mount(
          <Provider store={mockStore}>
            <SnackbarProvider>
              <MemoryRouter initialEntries={[`/${elem.testUrl}`]} initialIndex={0}>
                <Router />
              </MemoryRouter>
            </SnackbarProvider>
          </Provider>
        )
        // console.info(`/${elem.testUrl}`, wrapper.html())
        expect(wrapper.find(elem.expect)).toHaveLength(1)
      })
    })
  })
})
