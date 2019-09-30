import React, { Component } from 'react'
import { SnackbarProvider } from 'notistack';
import _times from 'lodash/times'
import UploadPage from 'Components/Gallery/UploadPageContainer/UploadPage'

let wrapper

let fixtureTags = ["Cat", "Dog", "Animals", "Flowers", "Scenery", "Monkey", "Mammals", "Lion", "Human", "Rabbit", "Gorilla", "Bird", "Owl", "Pig", "Fish", "Bear", "Reptile", "Insect", "Sponge", "Elephant", "Whale", "Shark", "Penguin", "Wolf", "Turtle", "Mouse", "Goose", "Kangaroo"]
let [upsertImage, verifyJWTToken, startLoading, stopLoading, userLogout] = _times(5, () => jest.fn())
let dataProps = {classes: {}, isLogin: true, tags: fixtureTags, access: "dummyAccess"}
let funcProps = {upsertImage, verifyJWTToken, startLoading, stopLoading, userLogout}

describe("<UploadPage />", () => {
  let initWrapper = (lastRespMsg) => {
    wrapper = mount(
      <SnackbarProvider>
        <UploadPage
          lastRespMsg={lastRespMsg}
          {...dataProps}
          {...funcProps}
        />
      </SnackbarProvider>
    )
    uploadPageNode = wrapper.find("UploadPage")
  }
  let uploadPageNode, uploadPageState
  it("onDrop images", (done) => {
    initWrapper("00000")
    let dropzoneNode = wrapper.find("Dropzone")
    dropzoneNode.prop('onDrop')([
      new File(["qqq"], "filename.txt", {type: "text/plain", lastModified: new Date()}),
      new File(["xxx"], "filename1.txt", {type: "text/plain", lastModified: new Date()})
    ])
    setTimeout(() => {
      uploadPageState = uploadPageNode.instance().state
      expect(uploadPageState.files.length).toBe(2)
      uploadPageNode.update()
      expect(wrapper.find(".div-uploadField").length).toBe(2)
      done()
    }, 50)
  })

  describe("Upload user dropped images", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })
    it("Upload successfully", (done) => {
      initWrapper("00000")
      let uploadFormNode
      let dropzoneNode = wrapper.find("Dropzone")
      dropzoneNode.prop('onDrop')([
        new File(["qqq"], "filename.txt", {type: "text/plain", lastModified: new Date()}),
        new File(["xxx"], "filename1.txt", {type: "text/plain", lastModified: new Date()})
      ])
      uploadPageNode.update()

      setTimeout(() => {
        wrapper.find(".form-upload").prop('onSubmit')({preventDefault: jest.fn()})
      }, 100)

      setTimeout(() => {
        expect(startLoading).toHaveBeenCalledTimes(1)
        expect(upsertImage).toHaveBeenCalledTimes(2)
        expect(stopLoading).toHaveBeenCalledTimes(1)
        done()
      }, 200)
    })

    it("Upload unsuccessfully", (done) => {
      initWrapper("99999")
      let uploadFormNode
      let dropzoneNode = wrapper.find("Dropzone")
      dropzoneNode.prop('onDrop')([
        new File(["qqq"], "filename.txt", {type: "text/plain", lastModified: new Date()}),
        new File(["xxx"], "filename1.txt", {type: "text/plain", lastModified: new Date()})
      ])
      uploadPageNode.update()

      setTimeout(() => {
        wrapper.find(".form-upload").prop('onSubmit')({preventDefault: jest.fn()})
      }, 100)

      setTimeout(() => {
        expect(startLoading).toHaveBeenCalledTimes(1)
        expect(upsertImage).toHaveBeenCalledTimes(1)
        expect(stopLoading).toHaveBeenCalledTimes(1)
        done()
      }, 200)
    })
  })

})
