import React, { Component } from 'react'
import IconButtonTab from 'Components/UI/IconButtonTab'
import {Form, Field} from 'react-final-form'

let wrapper


describe('<IconButtonTab />', () => {
  beforeAll(() => {
    wrapper = mount(
      <IconButtonTab
        updateTabIdx={jest.fn()}
        onClickList={[{
            onClickVar: 'userActivity', icon: "braille",
            content: 'User Activity' },
          {
            onClickVar: 'uploadedImgs', icon: "images outline",
            content: 'Uploaded Images'
          }]}
      />)
  })

  it("icon button tab simulate onClick", () => {
    wrapper.find('Button').forEach((elem, idx) => {
      elem.simulate('click')
      expect(wrapper.state().activeTab).toEqual(idx);
    })
  })
})
