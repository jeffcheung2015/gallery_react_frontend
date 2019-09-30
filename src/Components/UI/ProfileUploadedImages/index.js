import React, { Component } from 'react';
import "./index.scss"
import PropTypes from 'prop-types';
import _forEach from 'lodash/forEach';
import _map from 'lodash/map';
import DividerTitle from 'Components/UI/DividerTitle';
import { Pagination, Icon, Card, Grid, Modal, Input, Image, Dropdown, Button } from 'semantic-ui-react'
import { respCodes, respCodeToMsg } from "Utils/Config/constants";
import Loader from 'react-loaders'

class ProfileUploadedImages extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isContentLoading: false,
      imgUpdateOpen: false,
      imgPerPage: 6,
      currImgId: 1,
      currImgName: '',
      currImgDesc: '',
      currImgCreatedAt: '',
      currTags: [],
    }
    this.onPageChange = this.onPageChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.handleContentLoading = this.handleContentLoading.bind(this)
    this.onClickUpdateImage = this.onClickUpdateImage.bind(this)
    this.onDropdownChange = this.onDropdownChange.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this)
    this.handleModalOpen = this.handleModalOpen.bind(this)
  }

  handleContentLoading(type){
    if(type === 'start'){
      this.setState({ isContentLoading: true })
    }else{
      setTimeout(() => { //just to make the state transition look smooth
        this.setState({ isContentLoading: false })
      }, 300);
    }
  }

  async onPageChange(e, props){
    console.log(">>> onPageChange.props:", props, this.props)
    const {
      userId, lastRespMsg
    } = this.props

    const {
      imgPerPage,
    } = this.state
    this.handleContentLoading('start')
    await this.props.getImages(userId, props.activePage, imgPerPage)
    this.handleContentLoading('stop')
  }

  handleModalOpen(imgSrc, dataElem){
    console.log(`>>> handleModalOpen`)
    var newStateObj = {imgUpdateOpen: true}
    if(imgSrc){ newStateObj["currImgSrc"] = imgSrc }
    if(dataElem){
      newStateObj["currImgId"] = dataElem.id
      newStateObj["currImgName"] = dataElem.image_name
      newStateObj["currImgDesc"] = dataElem.image_desc
      newStateObj["currImgCreatedAt"] = dataElem.created_at
      newStateObj["currTags"] = dataElem.tags
    }
    this.setState(newStateObj)
  }

  handleModalClose(){
    this.setState({imgUpdateOpen: false})
  }

  async onClickUpdateImage(type){
    var formData = new FormData()
    const {
      currImgId, currTags, currImgName, currImgDesc, currImgCreatedAt, currPage, imgPerPage
    } = this.state

    if(!this.props.tags){ await this.props.getTags()}

    console.log("img_id:", currImgId)
    formData.append("img_id", currImgId)
    formData.append("created_at", new Date(currImgCreatedAt).getTime())
    this.props.startLoading()

    if(type === 'Update'){
      formData.append("image_name", currImgName)
      formData.append("image_desc", currImgDesc)
      _forEach(currTags, (tag, idx)=>{
        formData.append("tags", tag)
      })
      formData.append("api_type", "update")
    }else{
      formData.append("api_type", "delete")
    }
    await this.props.upsertImage(formData, this.props.access)
    if(this.props.lastRespMsg === respCodes.SUCCESS_REQ){
      this.props.handleSnackBar(`${type} the selected image successfully.`, 'success')
      await this.props.getImages(this.props.userId, currPage, imgPerPage)
      this.handleModalClose('uploadedImgs')
      if(type === 'Delete'){
        await this.props.getAuthUser(this.props.access)
      }
    }else{
      this.props.handleSnackBar(respCodeToMsg[this.props.lastRespMsg], "error")
    }
    this.props.stopLoading()
  }

  onInputChange(e, type){
    console.log(">>> onInputChange, e.target.value:", e.target.value)
    var tmpInputObj = {}
    tmpInputObj[(type == 'imgName') ? 'currImgName' : 'currImgDesc'] = e.target.value
    this.setState(tmpInputObj)
  }

  onDropdownChange(e, data){
    console.log(`>>> onDropdownChange, data.name: ${data.name}, data.value: ${data.value}`)
    const {
      currTags
    } = this.state
    this.setState({
      currTags: data.value
    })
  }

  render(){
    const {
      data, tags, numPages
    } = this.props
    const {
      isContentLoading, imgUpdateOpen, currImgId, currImgName,
       currImgSrc, currImgCreatedAt, currImgDesc, currTags
    } = this.state

    let tagsOptions = _map(tags, (tag, idx) =>({
      key: tag, text: tag,
      value: idx + 1,
    }))

    return(
      <div className="div-profileUploadedImages-wrapper">
        <DividerTitle
          iconName='images outline'
          title='Uploaded images'
        />
        <div className="div-uploadedImgs-wrapper">
          <Pagination
            className="Pagination-uploadedImgs"
            defaultActivePage={1}
            ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
            firstItem={{ content: <Icon name='angle double left' />, icon: true }}
            lastItem={{ content: <Icon name='angle double right' />, icon: true }}
            prevItem={{ content: <Icon name='angle left' />, icon: true }}
            nextItem={{ content: <Icon name='angle right' />, icon: true }}
            onPageChange={this.onPageChange}
            totalPages={numPages}
          />
          {
            (
              (isContentLoading) ?
                (<div className="div-contentLoader">
                  <Loader type="line-scale-pulse-out-rapid" color="#000000" active />
                </div>) :
                (
                  (data && data.length == 0) ?
                    (<div className="div-noImage-placeholder">
                      <span className="span-noImages"><Icon name="images"/> No Images</span>
                    </div>) :
                    (<Card className="Card-imgs">
                      <Grid columns={3} className="Grid-img-wrapper">
                        {
                          _map(data, (elem, idx) => {
                            const imgSrc = elem.image_file
                            return (
                              <Grid.Column className="GridCol-img" key={"GridCol-" + idx} onClick={() => this.handleModalOpen(imgSrc, elem)}>
                                <Card className="Card-img">
                                  <Image className="Image-uploadedImgs" src={(process.env.NODE_ENV == 'development' ? process.env.REACT_APP_SERVER_HOST_URL : "") + imgSrc}/>
                                </Card>
                              </Grid.Column>
                              )
                            }
                          )
                        }
                      </Grid>
                    </Card>)
                )
            )
          }
        </div>

        <Modal
          className="Modal-updateImage"
          open={imgUpdateOpen}
          onClose={this.handleModalClose}>
          <Modal.Header>Update Image</Modal.Header>
          <Modal.Content image>
            <Image wrapped size='medium' src={((process.env.NODE_ENV == 'development' ? process.env.REACT_APP_SERVER_HOST_URL : "") + currImgSrc) || ""} />
            <div className="div-updateImage-wrapper">
              <Input icon="list" iconPosition="left"
                placeholder="Image name"
                className="Input-imgName"
                value={currImgName}
                onChange={(e) => this.onInputChange(e,'imgName')}
                />
              <Input icon="newspaper outline" iconPosition="left"
                placeholder="Image description"
                className="Input-imgDesc"
                value={currImgDesc}
                onChange={(e) => this.onInputChange(e,'imgDesc')}
                />
              <Dropdown
                className="Dropdown-tags"
                placeholder='Tags'
                value={currTags}
                onChange={this.onDropdownChange}
                renderLabel={(label) => ({color:'blue', icon:"tag", content: label.text})}
                multiple
                search
                selection
                options={tagsOptions}
              />
            </div>
          </Modal.Content>
          <div className="div-deleteUpdateImageButton-wrapper">
            <Button onClick={() => this.onClickUpdateImage("Delete")} className="Button-deleteImage">Delete</Button>
            <Button onClick={() => this.onClickUpdateImage("Update")} className="Button-updateImage">Update</Button>
          </div>
        </Modal>
      </div>
    )
  }
}
export default ProfileUploadedImages;

ProfileUploadedImages.protoTypes = {
  userId: PropTypes.number.isRequired,
  lastRespMsg: PropTypes.string.isRequired,
  getImages: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
  getTags: PropTypes.func.isRequired,
  startLoading: PropTypes.func.isRequired,
  stopLoading: PropTypes.func.isRequired,
  upsertImage: PropTypes.func.isRequired,
  access: PropTypes.string.isRequired,
  getAuthUser: PropTypes.func.isRequired,
  handleSnackBar: PropTypes.func.isRequired,
}
