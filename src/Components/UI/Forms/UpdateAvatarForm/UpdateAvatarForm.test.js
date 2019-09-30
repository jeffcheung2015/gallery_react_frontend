import React, { Component } from 'react'
import _set from 'lodash/set'
import _times from 'lodash/times'
import UpdateAvatarForm from 'Components/UI/Forms/UpdateAvatarForm'

let wrapper

let [updateAvatar, getAuthUser, startLoading, stopLoading, handleSnackBar] = _times(5, () => jest.fn())

let propFuncs = {updateAvatar, getAuthUser, startLoading, stopLoading, handleSnackBar}
let propDatas = {lastRespMsg: "00000", classes: {updateAvatarArea: ""}, userProfile: {}}

let handleModalOpen, handleModalClose

describe("<UpdateAvatarForm />", () => {
  let imgProfileAvatarNode, buttonUpdateAvatarNode
  beforeEach((done) => {
    wrapper = mount(
      <UpdateAvatarForm
        {...propDatas}
        {...propFuncs}
      />
    );
    imgProfileAvatarNode = wrapper.find("Image .Image-profileAvatar")
    handleModalOpen = jest.spyOn(wrapper.instance(), 'handleModalOpen')
    handleModalClose = jest.spyOn(wrapper.instance(), 'handleModalClose')

    setTimeout(() => {
      jest.clearAllMocks()
      // put it here is to make sure the modal is opened and handleModalOpen is recorded after clearing of mock.calls
      imgProfileAvatarNode.simulate('click')
      done()
    })
  })

  it("update successfully", (done) => {
    wrapper.setState({avatarFile:"dummyAvatarFile"})
    buttonUpdateAvatarNode = wrapper.find("button.Button-updateAvatar")
    buttonUpdateAvatarNode.simulate('click')
    setTimeout(() => {
      expect(handleModalOpen).toHaveBeenCalledTimes(1)
      expect(startLoading).toHaveBeenCalledTimes(1)
      expect(updateAvatar).toHaveBeenCalledTimes(1)
      expect(getAuthUser).toHaveBeenCalledTimes(1)
      expect(handleModalClose).toHaveBeenCalledTimes(1)
      expect(stopLoading).toHaveBeenCalledTimes(1)
      done()
    })
  })
  it("havn't uploaded any image, update unsuccessfully", (done) => {
    buttonUpdateAvatarNode = wrapper.find("button.Button-updateAvatar")
    buttonUpdateAvatarNode.simulate('click')
    setTimeout(() => {
      expect(handleModalOpen).toHaveBeenCalledTimes(1)
      expect(handleSnackBar).toHaveBeenCalledWith("No image avatar file is uploaded.", 'error')
      done()
    })
  })

})
