import React, { Component } from 'react'
import _times from 'lodash/times'
import renderer from 'react-test-renderer';
import TextFieldWithMsg from 'Components/UI/FormComponents/TextFieldWithMsg';
import toJson from 'enzyme-to-json'
import { Form } from 'react-final-form'

let [onChange] = _times(1,() => jest.fn())

let wrapper

let funcProps = {onChange}

describe("<TextFieldWithMsg />", () => {
  describe("input -> correct output test", () => {
    it("Password type", () => {
      let dataProps = {fieldName: "Password", fieldType: "password",
       textFieldClassName: "Password-field", adornmentName: "VpnKey",
       textFieldType: "password", textFieldLabel: "Password"}
      const tree = shallow(
        <TextFieldWithMsg
          {...dataProps}
          {...funcProps}
        />
      ).dive()
      expect(toJson(tree)).toMatchSnapshot();
    })

    it("Username type", () => {
      let dataProps = {fieldName: "Username", fieldType: "text",
       textFieldClassName: "Username-field", adornmentName: "AccountCircle",
       textFieldType: "text", textFieldLabel: "Username"}
      const tree = shallow(
        <TextFieldWithMsg
          {...dataProps}
          {...funcProps}
        />
      ).dive()
      expect(toJson(tree)).toMatchSnapshot();
    })

    it("Email type", () => {
      let dataProps = {fieldName: "Email", fieldType: "email",
       textFieldClassName: "Email-field", adornmentName: "ContactMail",
       textFieldType: "text", textFieldLabel: "Email"}
      const tree = shallow(
        <TextFieldWithMsg
          {...dataProps}
          {...funcProps}
        />
      ).dive()
      expect(toJson(tree)).toMatchSnapshot();
    })

  })
})
