import React, { Component } from 'react';
import { respCodes } from 'Utils/Config/constants'
import { Form } from 'react-final-form'
import { fireEvent, act, cleanup, wait } from '@testing-library/react'
import Button from '@material-ui/core/Button';
import HomePage from 'Components/Gallery/HomePageContainer/HomePage'
import { SnackbarProvider } from 'notistack';
import _set from 'lodash/set'
import _times from 'lodash/times'

let fixtureData = [
  { created_at: '2018-06-12 09:55:22', id: '1', image_desc: "cat is running", image_file: "/api/cat.jpg", image_name: "cat", last_edit: "2018-06-12 09:55:22", tags: [1], user: '2' },
  { created_at: '2019-06-12 10:56:22', id: '2', image_desc: "dog is running", image_file: "/api/dog.jpg", image_name: "dog", last_edit: "2019-06-12 10:56:22", tags: [1], user: '2' },
  { created_at: '2019-06-12 11:56:22', id: '3', image_desc: "bird is running", image_file: "/api/bird.jpg", image_name: "bird", last_edit: "2019-06-12 10:56:22", tags: [1,2], user: '2'},
  { created_at: '2019-06-12 12:56:22', id: '4', image_desc: "bear is running", image_file: "/api/bear.jpg", image_name: "bear", last_edit: "2019-06-12 10:56:22", tags: [1,2], user: '2'},
  { created_at: '2019-06-12 13:56:22', id: '5', image_desc: "puppy is running", image_file: "/api/puppy.jpg", image_name: "puppy", last_edit: "2019-06-12 10:56:22", tags: [1,2,3], user: '2'},
  { created_at: '2019-06-12 14:56:22', id: '6', image_desc: "rabbit is running", image_file: "/api/rabbit.jpg", image_name: "rabbit", last_edit: "2019-06-12 10:56:22", tags: [1,2,3], user: '2'},
  { created_at: '2019-06-12 15:56:22', id: '7', image_desc: "lion is running", image_file: "/api/lion.jpg", image_name: "lion", last_edit: "2019-06-12 10:56:22", tags: [1,2,3,4], user: '2'},
  { created_at: '2019-06-12 16:56:22', id: '8', image_desc: "penguin is running", image_file: "/api/penguin.jpg", image_name: "penguin", last_edit: "2019-06-12 10:56:22", tags: [1,2,3,4], user: '2'},
  { created_at: '2019-06-12 17:56:22', id: '9', image_desc: "elephant is running", image_file: "/api/elephant.jpg", image_name: "elephant", last_edit: "2019-06-12 10:56:22", tags: [1,2,3,4,5], user: '2'},
  { created_at: '2019-06-12 18:56:22', id: '10', image_desc: "wolf is running", image_file: "/api/wolf.jpg", image_name: "wolf", last_edit: "2019-06-12 10:56:22", tags: [1,2,3,4,5], user: '2'},
  { created_at: '2019-06-12 19:56:22', id: '11', image_desc: "kitten is running", image_file: "/api/kitten.jpg", image_name: "kitten", last_edit: "2019-06-12 10:56:22", tags: [1,2,3,4,5,6], user: '2'},
  { created_at: '2019-06-12 20:56:22', id: '12', image_desc: "monkey is running", image_file: "/api/monkey.jpg", image_name: "monkey", last_edit: "2019-06-12 10:56:22", tags: [1,2,3,4,5,6], user: '2'},
]
let fixtureTags = ["Cat", "Dog", "Animals", "Flowers", "Scenery", "Monkey", "Mammals", "Lion", "Human", "Rabbit", "Gorilla", "Bird", "Owl", "Pig", "Fish", "Bear", "Reptile", "Insect", "Sponge", "Elephant", "Whale", "Shark", "Penguin", "Wolf", "Turtle", "Mouse", "Goose", "Kangaroo"]
let imgCount = 12, numPages = 2, currPage = 1, lastRespMsg = "00000", userId = '2', isLoading = false
let wrapper

let clearTagsButton, cardImg, tagsDropdown, imgPerPageDropdown, imageSearch

let spyGetImages, spyHandleContent
let [startLoading, stopLoading, getImages, getTags] = _times(4, () => jest.fn())
let propFuncs = {startLoading, stopLoading, getImages, getTags}
let propDatas = {isLoading, userId, data: fixtureData, tags: fixtureTags, numPages, currPage, imgCount, lastRespMsg}

describe("<HomePage />", () => {
  describe("user login unsuccessfully", () => {
    beforeEach((done) => {
      wrapper = mount(
        <HomePage
          {...propDatas}
          {...propFuncs}
        />
      )
      clearTagsButton = wrapper.find("Button .Button-clearSelectedTags")
      cardImg = wrapper.find("Card .Card-img")
      tagsDropdown = wrapper.find("div .Dropdown-tags")
      imgPerPageDropdown = wrapper.find(".Select-imgPerPage")
      imageSearch = wrapper.find("div .Search-image")

      spyGetImages = jest.spyOn(wrapper.props(), 'getImages')
      spyHandleContent = jest.spyOn(wrapper.instance(), 'handleContentLoading')
      setTimeout(() => {
        jest.clearAllMocks()
        //calling done here is to wait until all the jest spy functions ...
        //called first then reset all of them to 0
        done()
      })
    })
    it("image on click, a modal with the image detail displayed", (done) => {
      //just pick any of them
      cardImg.at(0).simulate("click")
      setTimeout(() => {
        expect(wrapper.find(".Modal-imageViewer").exists()).toBe(true)
        done()
      })
    })
    it("tags dropdown value changed", (done) => {
      let tagsDropdownProps = tagsDropdown.at(0).props()
      let newValues = [1,5]
      _set(tagsDropdownProps, 'value', newValues)

      let lastGetImagesCalledTimes = spyGetImages.mock.calls.length

      let labelTagsNodes = wrapper.find('Label .Label-tags')

      tagsDropdown.at(0).prop('onChange')({},tagsDropdownProps)
      expect(spyGetImages.mock.calls.length-lastGetImagesCalledTimes).toBe(1)
      wrapper.update()
      labelTagsNodes = wrapper.find('Label .Label-tags')

      expect(labelTagsNodes.length).toBe(2)
      newValues.forEach((elem, idx) => {
        expect(labelTagsNodes.at(idx).text()).toBe(fixtureTags[elem - 1])
      })
      setTimeout(() => {
        expect(spyHandleContent).toHaveBeenCalledWith("start")
        expect(spyHandleContent).toHaveBeenCalledWith("stop")
        expect(spyHandleContent).toHaveBeenCalledTimes(2)
        done()
      })
    })
    it("image per page dropdown value changed", (done) => {
      let imgPerPageDropdownProps = imgPerPageDropdown.at(0).props()
      _set(imgPerPageDropdownProps, 'value', 24)

      let lastGetImagesCalledTimes = spyGetImages.mock.calls.length
      imgPerPageDropdown.at(0).prop('onChange')({},imgPerPageDropdownProps)
      expect(spyGetImages.mock.calls.length-lastGetImagesCalledTimes).toBe(1)
      setTimeout(() => {
        expect(spyHandleContent).toHaveBeenCalledWith("start")
        expect(spyHandleContent).toHaveBeenCalledWith("stop")
        expect(spyHandleContent).toHaveBeenCalledTimes(2)
        done()
      })
    })
    it("pagination's current page changed",  (done) => {
      let paginationNode = wrapper.find("Pagination")
      let lastGetImagesCalledTimes = spyGetImages.mock.calls.length
      paginationNode.at(0).prop('onPageChange')({}, { activePage: 2 })
      expect(spyGetImages.mock.calls.length-lastGetImagesCalledTimes).toBe(1)
      setTimeout(() => {
        expect(spyHandleContent).toHaveBeenCalledWith("start")
        expect(spyHandleContent).toHaveBeenCalledWith("stop")
        expect(spyHandleContent).toHaveBeenCalledTimes(2)
        done()
      })
    })
    it("search field changed", (done) => {
      let lastGetImagesCalledTimes = spyGetImages.mock.calls.length
      imageSearch.at(0).prop('onSearchChange')({}, {value: 'aa'})
      setTimeout(() => {
        expect(spyGetImages.mock.calls.length-lastGetImagesCalledTimes).toBe(1)
        done()
      })
    })
    it("clear all selected tags by clicking button (Clear Selected Tags)", (done) => {
      // first add two tags into selected tags
      let tagsDropdownProps = tagsDropdown.at(0).props()
      let newValues = [3,7]
      _set(tagsDropdownProps, 'value', newValues)
      tagsDropdown.at(0).prop('onChange')({},tagsDropdownProps)
      // then click the 'Clear Selected Tags' to remove all
      let lastGetImagesCalledTimes = spyGetImages.mock.calls.length
      clearTagsButton.at(0).prop('onClick')()
      wrapper.update()

      expect(spyGetImages.mock.calls.length-lastGetImagesCalledTimes).toBe(1)
      expect(wrapper.find("Label .Label-tags").length).toBe(0)
      setTimeout(() => {
        // because of await this.props.getImages, we need to  the expects to wait for the calling of handleContentLoading with 'stop'
        expect(spyHandleContent).toHaveBeenCalledWith("start")
        expect(spyHandleContent).toHaveBeenCalledWith("stop")
        //each 2 called by onchange on the tagsDropdown and onclick on the button
        expect(spyHandleContent).toHaveBeenCalledTimes(4)
        done()
      })
    })
    it("clear the tags by clicking, [filter by tags]", (done) => {
      // first add three tags into selected tags
      let tagsDropdownProps = tagsDropdown.at(0).props()
      let newValues = [3,7,9,10]
      _set(tagsDropdownProps, 'value', newValues)
      tagsDropdown.at(0).prop('onChange')({},tagsDropdownProps)
      wrapper.update()

      // then click the 2nd label to remove the tag
      let labelTagsNodes = wrapper.find("Label .Label-tags")
      labelTagsNodes.at(1).prop('onClick')(1)
      wrapper.update()
      expect(wrapper.find("Label .Label-tags").length).toBe(3)
      setTimeout(() => {
        // because of await this.props.getImages, we need to  the expects to wait for the calling of handleContentLoading with 'stop'
        expect(spyHandleContent).toHaveBeenCalledWith("start")
        expect(spyHandleContent).toHaveBeenCalledWith("stop")
        //each 2 called by onchange on the tagsDropdown and onclick on the label
        expect(spyHandleContent).toHaveBeenCalledTimes(4)
        done()
      })
    })
  })
})
