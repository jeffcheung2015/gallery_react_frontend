import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { respCodes } from 'Utils/Config/constants'
import { Form } from 'react-final-form'
import { fireEvent, act, cleanup, wait } from '@testing-library/react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { SnackbarProvider } from 'notistack';
import LoginForm from 'Components/UI/Forms/LoginForm'
import _times from 'lodash/times'

let wrapper

let usernameField, passwordField

let [userLogin, startLoading, stopLoading, enqueueSnackbar] = _times(4, () => jest.fn())
let propFuncs = {userLogin, startLoading, stopLoading, enqueueSnackbar}

describe("<LoginForm />", () => {
  describe("user login unsuccessfully", () => {
    beforeEach(() => {
      wrapper = render(
        <LoginForm
          classes={{}}
          {...propFuncs}
        />
      )
      let allInputField = wrapper.container.querySelectorAll("input")
      usernameField = allInputField[0]
      passwordField = allInputField[1]
    })
    afterEach(() => {
      cleanup()
    })
    it("username length > 1, password length < 8", () => {
      fireEvent.change(usernameField, {target:{value:'a'}})
      fireEvent.change(passwordField, {target:{value:'passwor'}})
      fireEvent.submit(wrapper.container.querySelector("form"))
      expect(wrapper.findByText("Password length must be greater than 8.")).not.toBeNull()
    })
    it("username length == 0", () => {
      fireEvent.change(passwordField, {target:{value:'a'}})
      fireEvent.submit(wrapper.container.querySelector("form"))
      expect(wrapper.findByText("Required field")).not.toBeNull()
    })
    it("password length == 0", () => {
      fireEvent.change(usernameField, {target:{value:'a'}})
      fireEvent.submit(wrapper.container.querySelector("form"))
      expect(wrapper.findByText("Required field")).not.toBeNull()
    })
    it("username and password length == 0, recaptcha was not solved", () => {
      fireEvent.submit(wrapper.container.querySelector("form"))
      expect(wrapper.findByText("Required field")).not.toBeNull()
      expect(wrapper.findByText("Recaptcha verification needs to be done.")).not.toBeNull()
    })
  })

  describe("user login successfully", () => {
    let textFieldNodes, formNode
    beforeEach(() => {
      wrapper = mount(
        <LoginForm
          classes={{}}
          {...propFuncs}
        />
      )
      formNode = wrapper.find(Form).at(0)
      textFieldNodes = wrapper.find(TextField)
    })
    it("username length > 0 and password length >= 8 and recaptcha solved", (done) => {
      let username = 'dummyusername', password = 'dummypassword', confirmPassword = 'dummypassword', email = 'dummyemail@a.com';
      textFieldNodes.forEach((node, idx) => {
        if(node.hasClass("TextFieldWithMsg-username")){
          node.prop("onChange")({target: {value: username}})
        }else if(node.hasClass("TextFieldWithMsg-password")){
          node.prop("onChange")({target: {value: password}})
        }
      })
      wrapper.setState({recaptchaToken: "dummyToken"})
      formNode.prop("onSubmit")({ username, password, confirmPassword, email })
      setTimeout(() => {
        expect(startLoading).toHaveBeenCalledTimes(1)
        expect(userLogin).toHaveBeenCalledTimes(1)
        expect(stopLoading).toHaveBeenCalledTimes(1)
        done()
      })
    })
  })
})
