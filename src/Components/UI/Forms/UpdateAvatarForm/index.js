import React, { Component } from 'react';
import "./index.scss"
import PropTypes from 'prop-types';
import RippleDropzoneArea from 'Components/UI/RippleDropzoneArea';
import { respCodes, respCodeToMsg } from "Utils/Config/constants";
import { Modal, Image, Card, Button } from 'semantic-ui-react'

class UpdateAvatarForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      avatarUpdateOpen: false,
      avatarFile: '',
      updatedAvatar: '',
    }
    this.onUpdateAvatar = this.onUpdateAvatar.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.onDrop = this.onDrop.bind(this)

  }

  handleModalClose(){
    this.setState({avatarUpdateOpen: false})
  }

  handleModalOpen(){
    this.setState({avatarUpdateOpen: true})
  }

  async onUpdateAvatar(){
    // validate the avatar to be uploaded whether it is empty or not
    console.log(">>> onUpdateAvatar. this.state.avatarFile: ", this.state.avatarFile)
    if (!!!this.state.avatarFile){
      this.props.handleSnackBar("No image avatar file is uploaded.", 'error')
    }else{
      this.props.startLoading()
      var formData = new FormData()
      formData.append("avatar", this.state.avatarFile)

      await this.props.updateAvatar(formData, this.props.access, {
        onSuccess: () => this.props.handleSnackBar("Update avatar successfully.", 'success'),
        onFail: (resp_code) => this.props.handleSnackBar(respCodeToMsg[resp_code], 'error')
      })
      if (this.props.lastRespMsg === respCodes.SUCCESS_REQ){
        // update the updated avatar by calling getUser again
        await this.props.getAuthUser(this.props.access)
        this.handleModalClose('avatar')
      }
      this.props.stopLoading()
    }
  }

  onDrop(file){
    console.log(">>> onDrop.file:", file[0])
    const reader = new FileReader()
    var res = {}
    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = () => {
      this.setState({
        avatarFile: file[0],
        updatedAvatar: reader.result,
      })
    }
    reader.readAsDataURL(file[0])
  }

  render(){
    const{
      avatarUpdateOpen, updatedAvatar
    } = this.state
    const{
      classes, userProfile
    } = this.props
    return(
      <div className="div-updateAvatar-wrapper">
        <Image
          onClick={() => this.handleModalOpen()}
          src={((process.env.NODE_ENV == 'development' ? process.env.REACT_APP_SERVER_HOST_URL : "") + userProfile.avatar) || ""} wrapped
          className="Image-profileAvatar"/>
        <Modal
          className="Modal-updateAvatar"
          open={avatarUpdateOpen}
          onClose={() => this.handleModalClose()}
          >
          <Modal.Header>Profile Picture</Modal.Header>
          <Modal.Content image>
            <Image size='medium' src={updatedAvatar || ((process.env.NODE_ENV == 'development' ? process.env.REACT_APP_SERVER_HOST_URL : "") + userProfile.avatar) || ""} wrapped />
            <Modal.Description>
              <Card className="Card-updateAvatar">
                <RippleDropzoneArea
                  cardActionAreaClassName={classes.updateAvatarArea}
                  onDrop={this.onDrop}
                  mutiple={false}
                />
              </Card>
            </Modal.Description>
          </Modal.Content>
          <Button className="Button-updateAvatar" onClick={this.onUpdateAvatar}>
            Change
          </Button>
        </Modal>
      </div>
    )
  }
}
export default UpdateAvatarForm;

UpdateAvatarForm.protoTypes = {
  lastRespMsg: PropTypes.string.isRequired,
  updateAvatar: PropTypes.func.isRequired,
  getAuthUser: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  userProfile: PropTypes.object.isRequired,
  startLoading: PropTypes.func.isRequired,
  stopLoading: PropTypes.func.isRequired,
  handleSnackBar: PropTypes.func.isRequired,
}
