import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils';
import _set from 'lodash/set'
import _times from 'lodash/times'
import UpdateProfileForm from 'Components/UI/Forms/UpdateProfileForm'
import TextField from '@material-ui/core/TextField';
import { Form } from 'react-final-form'

let wrapper

let [updateUser, getAuthUser, startLoading, stopLoading, handleSnackBar] = _times(5, () => jest.fn())

let propFuncs = {updateUser, getAuthUser, startLoading, stopLoading, handleSnackBar}
let propDatas = {lastRespMsg: "00000", access: ''}

let handleModalOpen, handleModalClose

describe("<UpdateProfileForm />", () => {
  let password = 'password', retypePassword = 'password', email = 'user@email.com';
  beforeEach((done) => {
    wrapper = mount(
      <UpdateProfileForm
        {...propDatas}
        {...propFuncs}
      />
    )
    handleModalOpen = jest.spyOn(wrapper.instance(), 'handleModalOpen')
    handleModalClose = jest.spyOn(wrapper.instance(), 'handleModalClose')
    setTimeout(() => {
      jest.clearAllMocks()
      wrapper.find(".Button-updateProfile").at(0).simulate('click')
      done()
    })
  })
  it("update unsuccessfully", async (done) => {
    let res = await wrapper.find(Form).at(0).prop('onSubmit')({})
    setTimeout(() => {
      expect(res).toEqual({
        password: 'Password length must be greater than 8.',
        email: 'Not a valid email.'
      })
      expect(handleModalOpen).toHaveBeenCalledTimes(1)
      expect(startLoading).toHaveBeenCalledTimes(0)
      done()
    })
  })
  it("update successfully",  (done) => {
    let email = 'user2ss@gmail.com', password = 'dummypassword', retypePassword = 'dummypassword'
    wrapper.find(Form).at(0).prop('onSubmit')({ email, password, retypePassword })

    setTimeout(() => {
      expect(handleModalOpen).toHaveBeenCalledTimes(1)
      expect(startLoading).toHaveBeenCalledTimes(1)
      expect(updateUser).toHaveBeenCalledTimes(1)
      expect(getAuthUser).toHaveBeenCalledTimes(1)
      expect(handleModalClose).toHaveBeenCalledTimes(1)
      expect(stopLoading).toHaveBeenCalledTimes(1)
      done()
    })
  })
})
