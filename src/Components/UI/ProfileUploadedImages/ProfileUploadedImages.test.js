import React, { Component } from 'react'
import ProfileUploadedImages from 'Components/UI/ProfileUploadedImages';
import _set from 'lodash/set'
import _times from 'lodash/times'
import { Form } from 'react-final-form'

let wrapper
let fixtureData = [
  { created_at: '2018-06-12 09:55:22', id: '1', image_desc: "cat is running", image_file: "/api/cat.jpg", image_name: "cat", last_edit: "2018-06-12 09:55:22", tags: [1], user: '2' },
  { created_at: '2019-06-12 10:56:22', id: '2', image_desc: "dog is running", image_file: "/api/dog.jpg", image_name: "dog", last_edit: "2019-06-12 10:56:22", tags: [1], user: '2' },
  { created_at: '2019-06-12 11:56:22', id: '3', image_desc: "bird is running", image_file: "/api/bird.jpg", image_name: "bird", last_edit: "2019-06-12 10:56:22", tags: [1,2], user: '2'},
  { created_at: '2019-06-12 12:56:22', id: '4', image_desc: "bear is running", image_file: "/api/bear.jpg", image_name: "bear", last_edit: "2019-06-12 10:56:22", tags: [1,2], user: '2'},
  { created_at: '2019-06-12 13:56:22', id: '5', image_desc: "puppy is running", image_file: "/api/puppy.jpg", image_name: "puppy", last_edit: "2019-06-12 10:56:22", tags: [1,2,3], user: '2'},
  { created_at: '2019-06-12 14:56:22', id: '6', image_desc: "rabbit is running", image_file: "/api/rabbit.jpg", image_name: "rabbit", last_edit: "2019-06-12 10:56:22", tags: [1,2,3], user: '2'},
]
let fixtureTags = ["Cat", "Dog", "Animals", "Flowers", "Scenery", "Monkey", "Mammals", "Lion", "Human", "Rabbit", "Gorilla", "Bird", "Owl", "Pig", "Fish", "Bear", "Reptile", "Insect", "Sponge", "Elephant", "Whale", "Shark", "Penguin", "Wolf", "Turtle", "Mouse", "Goose", "Kangaroo"]

let [getImages, getTags, startLoading, stopLoading, upsertImage, getAuthUser, handleSnackBar] =
 _times(7, () => jest.fn())

let handleModalOpen, handleModalClose
let funcProps = {getImages, getTags, startLoading, stopLoading, upsertImage, getAuthUser, handleSnackBar}
let dataProps = {userId: 1, data: fixtureData, lastRespMsg: '00000', tags: fixtureTags, access: "dummyAccess", numPages: 1}
describe("<ProfileUploadedImages />", () => {
  beforeEach((done) => {
    wrapper = mount(
      <ProfileUploadedImages
        {...dataProps}
        {...funcProps}
      />
    )
    handleModalOpen = jest.spyOn(wrapper.instance(), 'handleModalOpen')
    handleModalClose = jest.spyOn(wrapper.instance(), 'handleModalClose')
    setTimeout(() => {
      jest.clearAllMocks()
      wrapper.find(".GridCol-img").at(0).simulate("click")
      done()
    })
  })
  it("update selected image", (done) => {
    wrapper.find(".Modal-updateImage").find("Button .Button-deleteImage").at(0).prop("onClick")()

    setTimeout(() => {
      expect(handleModalOpen).toHaveBeenCalledTimes(1)
      expect(getTags).toHaveBeenCalledTimes(0)
      expect(startLoading).toHaveBeenCalledTimes(1)
      expect(upsertImage).toHaveBeenCalledTimes(1)
      expect(getImages).toHaveBeenCalledTimes(1)
      expect(handleModalClose).toHaveBeenCalledTimes(1)
      expect(getAuthUser).toHaveBeenCalledTimes(1)
      expect(stopLoading).toHaveBeenCalledTimes(1)
      done()
    });
  })
  it("delete selected image", (done) => {
    let updateImageWrapperNode = wrapper.find(".div-updateImage-wrapper")
    let imgNameFieldNode = updateImageWrapperNode.find(".Input-imgName")
    let imgDescFieldNode = updateImageWrapperNode.find(".Input-imgDesc")
    let tagsDropdownFieldNode = updateImageWrapperNode.find(".Dropdown-tags")

    imgNameFieldNode.at(0).prop("onChange", { target: { value: 'iamimgname' } })
    imgDescFieldNode.at(0).prop("onChange", { target: { value: 'iamimgdesc' } })
    tagsDropdownFieldNode.at(0).prop("onChange", { target: { value: [2,3] } })

    wrapper.find(".Modal-updateImage").find("Button .Button-updateImage").at(0).prop("onClick")()
    setTimeout(() => {
      expect(handleModalOpen).toHaveBeenCalledTimes(1)
      expect(getTags).toHaveBeenCalledTimes(0)
      expect(startLoading).toHaveBeenCalledTimes(1)
      expect(upsertImage).toHaveBeenCalledTimes(1)
      expect(getImages).toHaveBeenCalledTimes(1)
      expect(handleModalClose).toHaveBeenCalledTimes(1)
      expect(getAuthUser).toHaveBeenCalledTimes(0)
      expect(stopLoading).toHaveBeenCalledTimes(1)
      done()
    });
  })

})
