import configureStore from 'redux-mock-store'
import * as actions from 'Reducer/UI/UIActions'
import * as types from 'Reducer/ReducerType'
import thunk from 'redux-thunk'

let middlewares = [thunk]
let mockStore = configureStore(middlewares)


describe("loader", () => {
  let store, expectedActions
  it("startLoading", () => {
    store = mockStore({ isLoading: false })
    expectedActions = [ {type: types.UI_START_LOADING, isLoading: true} ]
    store.dispatch(actions.startLoading())
    expect(store.getActions()).toEqual(expectedActions)
  })
  it("stopLoading", () => {
    store = mockStore({ isLoading: false })
    expectedActions = [ {type: types.UI_STOP_LOADING, isLoading: false} ]
    store.dispatch(actions.stopLoading())
    expect(store.getActions()).toEqual(expectedActions)
  })
})
