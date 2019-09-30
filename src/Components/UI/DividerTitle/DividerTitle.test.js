import React, { Component } from 'react'
import _times from 'lodash/times'
import renderer from 'react-test-renderer';
import DividerTitle from 'Components/UI/DividerTitle';
import toJson from 'enzyme-to-json'


let wrapper

let dataProps = {headerClassName: "title-class", iconName: "images outline", title: "i am title"}

describe("<DividerTitle />", () => {
  it("input -> correct output test", () => {
    const tree = shallow(
      <DividerTitle
        {...dataProps}
      />
    ).dive()
    expect(toJson(tree)).toMatchSnapshot();
  })
})
