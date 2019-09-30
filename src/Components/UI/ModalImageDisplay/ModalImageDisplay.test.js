import React, { Component } from 'react'
import _times from 'lodash/times'
import renderer from 'react-test-renderer';
import ModalImageDisplay from 'Components/UI/ModalImageDisplay';
import toJson from 'enzyme-to-json'
let [handleModalClose] = _times(1,() => jest.fn())

let wrapper

let fixtureTags = ["Cat", "Dog", "Animals", "Flowers", "Scenery", "Monkey", "Mammals", "Lion", "Human", "Rabbit", "Gorilla", "Bird", "Owl", "Pig", "Fish", "Bear", "Reptile", "Insect", "Sponge", "Elephant", "Whale", "Shark", "Penguin", "Wolf", "Turtle", "Mouse", "Goose", "Kangaroo"]

let dataProps = {imgPreviewOpen: false, currImgName: "zebra", currImgDesc: 'dummy desc',
 currImgCreatedAt: '2018-06-12 09:55:22', currTags : [2,3,4], tags: fixtureTags, currImgSrc: "/api/zebra.jpg"}
let funcProps = {handleModalClose}

describe("<ModalImageDisplay />", () => {
  it("input -> correct output test", () => {
    const tree = shallow(
      <ModalImageDisplay
        {...dataProps}
        {...funcProps}
      />
    ).dive()
    expect(toJson(tree)).toMatchSnapshot();
  })
})
