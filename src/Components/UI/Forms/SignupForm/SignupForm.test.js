import React, { Component } from 'react';
import { respCodes } from 'Utils/Config/constants'
import { Form } from 'react-final-form'
import { fireEvent, act, cleanup, wait } from '@testing-library/react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { SnackbarProvider } from 'notistack';
import SignupForm from 'Components/UI/Forms/SignupForm'
import _times from 'lodash/times'

let wrapper

let usernameField, emailField, passwordField, retypePasswordField

let [userSignup, startLoading, stopLoading, enqueueSnackbar] = _times(4, () => jest.fn())
let propFuncs = {userSignup, startLoading, stopLoading, enqueueSnackbar}

describe("<SignupForm />", () => {
  describe("user signup unsuccessfully", () => {
    beforeEach(() => {
      wrapper = render(
        <SignupForm
          classes={{}}
          {...propFuncs}
        />
      )
      let allInputField = wrapper.container.querySelectorAll("input")
      usernameField = allInputField[0]
      emailField = allInputField[1]
      passwordField = allInputField[2]
      retypePasswordField = allInputField[3]
    })
    afterEach(() => {
      //Unmounts React trees that were mounted with render to avoid memory leak
      cleanup()
    })
    //findByText by default is  function
    it("username length > 1, password length < 8",  () => {
      fireEvent.change(usernameField, {target:{value:'a'}})
      fireEvent.change(passwordField, {target:{value:'passwor'}})
      fireEvent.submit(wrapper.container.querySelector("form"))
      expect(wrapper.findByText("Password length must be greater than 8.")).not.toBeNull()

    })
    it("username length == 0",   () => {
      fireEvent.change(passwordField, {target:{value:'a'}})
      fireEvent.submit(wrapper.container.querySelector("form"))
      expect(wrapper.findByText("Required field")).not.toBeNull()
    })
    it("password length == 0",   () => {
      fireEvent.change(usernameField, {target:{value:'a'}})
      fireEvent.submit(wrapper.container.querySelector("form"))
      expect(wrapper.findByText("Required field")).not.toBeNull()
    })
    it("username and password length == 0, recaptcha was not solved",   () => {
      fireEvent.submit(wrapper.container.querySelector("form"))
      expect(wrapper.findByText("Required field")).not.toBeNull()
      expect(wrapper.findByText("Recaptcha verification needs to be done.")).not.toBeNull()
    })
    it("password and retype password don't match",   () => {
      fireEvent.change(passwordField, {target:{value:'abcdefgh'}})
      fireEvent.change(retypePasswordField, {target:{value:'bcdefghi'}})
      fireEvent.submit(wrapper.container.querySelector("form"))
      expect(wrapper.findByText("Password and Confirm Password field don't match.")).not.toBeNull()
    })
    it("invalid email",   () => {
      fireEvent.change(emailField, {target:{value:'abcdefgh@xxx'}})
      fireEvent.submit(wrapper.container.querySelector("form"))
      expect(wrapper.findByText("Not a valid email.")).not.toBeNull()
    })

  })

  describe("user signup successfully", () => {
    let textFieldNodes, formNode
    beforeEach(() => {
        wrapper = mount(
        <SignupForm
          classes={{}}
          {...propFuncs}
        />
      )
      formNode = wrapper.find(Form).at(0)
      textFieldNodes = wrapper.find(TextField)
    })
    it("username length > 0 and password length >= 8 and password == confirm password and recaptcha solved and valid email",  (done) => {
      let username = 'dummyusername', password = 'dummypassword', confirmPassword = 'dummypassword', email = 'dummyemail@a.com';
      textFieldNodes.forEach((node, idx) => {
        if(node.hasClass("TextFieldWithMsg-username")){
          node.prop("onChange")({target: {value: 'dummyusername'}})
        }else if(node.hasClass("TextFieldWithMsg-password")){
          node.prop("onChange")({target: {value: 'dummypassword'}})
        }else if(node.hasClass("TextFieldWithMsg-confirmPassword")){
          node.prop("onChange")({target: {value: 'dummypassword'}})
        }else if(node.hasClass("TextFieldWithMsg-email")){
          node.prop("onChange")({target: {value: 'dummyemail@a.com'}})
        }
      })
      // await the setstate completed is important to make the recaptchatoken appeared in the this.state inside the SignupForm
      wrapper.setState({recaptchaToken: "dummyToken"})
      formNode.prop("onSubmit")({ username, password, confirmPassword, email })
      setTimeout(() => {
        expect(startLoading).toHaveBeenCalledTimes(1)
        expect(userSignup).toHaveBeenCalledTimes(1)
        expect(stopLoading).toHaveBeenCalledTimes(1)
        done()
      })
    })
  })
})
