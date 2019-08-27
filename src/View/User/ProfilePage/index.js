import React, { Component } from 'react';
import "./index.scss"
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAuthUser, verifyJWTToken, userLogout } from "Reducer/User/UserActions";
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/styles';
import ContactMail from '@material-ui/icons/ContactMail';
import DateRange from '@material-ui/icons/DateRange';
import Update from '@material-ui/icons/Update';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Loader from 'react-loaders'
import _isEmpty from 'lodash/isEmpty'
import { respCodes, respCodeToMsg } from "Utils/Config/constants";
import CardActionArea from '@material-ui/core/CardActionArea';
import moment from 'moment';
import { BASE_URL } from 'Utils/Config/constants';
import { Form, Field } from 'react-final-form'
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Button, Header, Pagination, Icon, Image, Modal, Label, Grid, Dropdown, Input, Divider } from 'semantic-ui-react'
import VpnKey from '@material-ui/icons/VpnKey';
import AddPhotoAlternate from '@material-ui/icons/AddPhotoAlternate';
import Dropzone from 'react-dropzone';
import { updateAvatar, updateUser } from 'Reducer/User/UserActions';
import { startLoading, stopLoading } from 'Reducer/UI/UIActions';
import { getImages, upsertImage, getTags } from 'Reducer/API/APIActions';
import _forEach from 'lodash/forEach';
import _map from 'lodash/map';
import _range from 'lodash/range';
import { withSnackbar } from 'notistack';
import { isValidEmail } from 'Utils/UtilFunctions';
import CalendarHeatmap from 'react-calendar-heatmap';
import ReactTooltip from 'react-tooltip';

const overrideStyles = (theme) => ({
  leftCard:{
    width: "300px",
    minHeight: "500px"
  },
  leftCardContent:{
    paddingLeft: "0px",

  },
  updateAvatarArea:{
    height: '100%'
  },
  rightCard:{
    width: "600px",
    minHeight: "550px",
    marginLeft: "20px"
  },


});

class ProfilePage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      currPage: 1,
      imgPerPage: '6',
      rightCardTab: 'userActivity',
      avatarFile: null,
      updatedAvatar: null,
      profileUpdateOpen: false,
      avatarUpdateOpen: false,
      imgUpdateOpen: false,
      currImgId: -1,
      currImgSrc: "",
      currImgName: "",
      currImgDesc: "",
      currImgCreatedAt: "",
      currTags: []
    }
    this.onDrop = this.onDrop.bind(this)
    this.redirect = this.redirect.bind(this)
    this.onUpdateProfile = this.onUpdateProfile.bind(this);
    this.onUpdateAvatar = this.onUpdateAvatar.bind(this);
    this.onFormValidate = this.onFormValidate.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onDropdownChange = this.onDropdownChange.bind(this);
    this.onClickUpdateImage = this.onClickUpdateImage.bind(this)
    this.changeRightTabContent = this.changeRightTabContent.bind(this);
  }
  redirect(path){
    this.props.history.push(path);
  }

  async componentDidMount(){
    this.props.startLoading()
    const access = localStorage.getItem("access")
    const refresh = localStorage.getItem("refresh")
    await this.props.verifyJWTToken(access, refresh)
    //user restricted area, to avoid access without valid jwt token atm user access this page
    var shouldLogout = true
    if (this.props.lastRespMsg === respCodes.SUCCESS_REQ){
      await this.props.getAuthUser(access)
      if (this.props.lastRespMsg === respCodes.SUCCESS_REQ){
        const {
          currPage, imgPerPage
        } = this.state
        shouldLogout = false

        await this.props.getImages(this.props.userId, currPage, imgPerPage)
        this.props.stopLoading()
      }
    }
    if(shouldLogout){
      await this.props.userLogout();
      this.props.stopLoading()
    }
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
      this.handleSnackBar(`${type} the selected image successfully.`, 'success')
      await this.props.getImages(this.props.userId, currPage, imgPerPage)
      this.handleModalClose('uploadedImgs')
      if(type === 'Delete'){
        await this.props.getAuthUser(this.props.access)
      }
    }else{
      this.handleSnackBar(respCodeToMsg[this.props.lastRespMsg], "error")
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

  handleModalClose(modalType){
    console.log(">>> handleModalClose")
    var newStateObj = (modalType == 'profile') ? {profileUpdateOpen: false} :
                      (modalType == 'avatar') ? {avatarUpdateOpen: false} : {imgUpdateOpen: false}
    this.setState(newStateObj)
  }
  handleModalOpen(modalType, imgSrc, dataElem){
    console.log(">>> handleModalOpen")
    var newStateObj = (modalType == 'profile') ? {profileUpdateOpen: true} :
                      (modalType == 'avatar') ? {avatarUpdateOpen: true} : {imgUpdateOpen: true}
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

  handleSnackBar(msg, variant){
    this.props.enqueueSnackbar(msg, {variant})
  }

  async onUpdateAvatar(){
    // validate the avatar to be uploaded whether it is empty or not
    console.log(">>> onUpdateAvatar. this.state.avatarFile: ", this.state.avatarFile)
    if (!!!this.state.avatarFile){
      this.handleSnackBar("No image avatar file is uploaded.", 'error')
    }else{
      this.props.startLoading()
      var formData = new FormData()
      formData.append("avatar", this.state.avatarFile)

      await this.props.updateAvatar(formData, this.props.access, {
        onSuccess: () => this.handleSnackBar("Update avatar successfully.", 'success'),
        onFail: (resp_code) => this.handleSnackBar(respCodeToMsg[resp_code], 'error')
      })
      if (this.props.lastRespMsg === respCodes.SUCCESS_REQ){
        // update the updated avatar by calling getUser again
        await this.props.getAuthUser(this.props.access)

        this.handleModalClose('avatar')
      }

      this.props.stopLoading()
    }
  }

  async onUpdateProfile(formVals){
    console.log(">>> onUpdateProfile.formVals:", formVals)

    var submitErrorObj = {}
    const {password, retypePassword, email} = formVals
    if(password != retypePassword){
      submitErrorObj.password = "Password and Retype Password field don't match.";
    }
    if(password.length < 8){
      submitErrorObj.password = "Password length must be greater than 8.";
    }
    if (!isValidEmail(email)){
      submitErrorObj.email = "Not a valid email."
    }
    if (!_isEmpty(submitErrorObj)){
      return submitErrorObj
    }

    this.props.startLoading()

    var formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)

    await this.props.updateUser(formData, this.props.access, {
      onSuccess: () => this.handleSnackBar("Update user successfully.", 'success'),
      onFail: (resp_code) => this.handleSnackBar(respCodeToMsg[resp_code], 'error')
    })
    if (this.props.lastRespMsg === respCodes.SUCCESS_REQ){
      // update the updated profile by calling getUser again
      await this.props.getAuthUser(this.props.access)

      this.handleModalClose('profile')
    }
    this.props.stopLoading()
  }

  onFormValidate(val){
    console.log('>>> onFormValidate: ', val)
    const errorObj = {};
    _forEach(['email', 'password', 'retypePassword'], (e) => {
      if(!val[e]){
        errorObj[e] = 'Required field'
      }
    })
    return errorObj;
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

  changeRightTabContent(contentType){
    this.setState({
      rightCardTab: contentType
    })
  }

  async onPageChange(e, props){
    console.log(">>> ProfilePage.onPageChange.props:", props, this.props)
    const {
      userId, lastRespMsg
    } = this.props

    const {
      imgPerPage,
    } = this.state

    startLoading()

    await this.props.getImages(-1, props.activePage, imgPerPage)

    stopLoading()
  }

  render(){
    const {
      userDetail, userProfile, isLogin, classes, userId, userDtlFetched,
      data, imgCount, numPages, tags
    } = this.props

    const {
      updatedAvatar, profileUpdateOpen, avatarUpdateOpen,
      imgUpdateOpen, rightCardTab, currImgSrc,
      currImgName, currImgDesc, currTags
    } = this.state

    let noOfDay = 120
    let endDate = new Date()
    let startDate = new Date().setDate(endDate.getDate() - noOfDay)

    let dateCountList = new Array(noOfDay)
    _forEach(userProfile.activity, (activity, idx) => {
      let dateIdx = endDate.getDate()-new Date(activity[0]).getDate()
      dateCountList[dateIdx] = {
        date: new Date(activity[0]),
        count: activity[1]
      }
    })
    _forEach(_range(noOfDay), (val, idx) => {
      if(!dateCountList[idx]){
        dateCountList[idx] = {
          date: new Date().setDate(endDate.getDate() - val),
          count: 0
        }
      }
    })

    let tagsOptions = _map(tags, (tag, idx) => {
      return{
        key: tag,
        text: tag,
        value: idx + 1,
      }
    })

    return(
      <div className="div-profilePage-wrapper">
        <Card className={classes.leftCard}>
          {!userDtlFetched ?
            <Loader
              className="Loader-profile"
              type="line-scale-pulse-out-rapid"
              color="#000000"
              active
            /> :
            <div className="div-leftCard-area">
              <CardActionArea>
                <Modal
                  className="Modal-updateAvatar"
                  open={avatarUpdateOpen}
                  onClose={() => this.handleModalClose('avatar')}
                  trigger={
                    <Image
                    onClick={() => this.handleModalOpen('avatar')}
                    src={BASE_URL + userProfile.avatar} wrapped
                    className="Image-profileAvatar"/>
                  }>
                  <Modal.Header>Profile Picture</Modal.Header>
                  <Modal.Content image>
                    <Image size='medium' src={updatedAvatar || (BASE_URL + userProfile.avatar)} wrapped />
                    <Modal.Description>
                      <Card className={classes.updateAvatarArea}>
                        <CardActionArea className={classes.updateAvatarArea}>
                          <Dropzone
                            multiple={false}
                            onDrop={this.onDrop}
                            >
                            {({getRootProps, getInputProps}) => (
                              <section>
                                <div {...getRootProps()}>
                                  <input {...getInputProps()} />
                                  <span className="span-drapdropText">
                                    <AddPhotoAlternate />
                                    Drag and drop image here, or click to select image to upload.
                                  </span>
                                </div>
                              </section>
                            )}
                          </Dropzone>
                        </CardActionArea>
                      </Card>
                    </Modal.Description>
                  </Modal.Content>
                  <Button className="Button-updateAvatar" onClick={this.onUpdateAvatar}>
                    Change
                  </Button>
                </Modal>

              </CardActionArea>

              <CardContent className={classes.leftCardContent}>
                <Label className="Label-profile">
                  <Icon name="user"/>
                  Username: {userDetail.username}
                </Label>
                <Label className="Label-profile">
                  <Icon name="info"/>
                  User ID: {userId}
                </Label>
                <Label className="Label-profile">
                  <Icon name="mail"/>
                  Email: {userDetail.email}
                </Label>
                <Label className="Label-profile">
                  <Icon name="add to calendar"/>
                  Joined In: {moment(new Date(userDetail.createdAt)).format("MM-DD-YYYY")}
                </Label>
                <Label className="Label-profile">
                  <Icon name="sign-in"/>
                  Last Login: {moment(new Date(userDetail.lastLoginAt)).format("MM-DD-YYYY HH:mm A")}
                </Label>
                <Label className="Label-profile">
                  <Icon name="undo"/>
                  Last Update: {userProfile.lastProfileEdit ?
                    moment(new Date(userProfile.lastProfileEdit)).format("MM-DD-YYYY HH:mm A"):
                    'N/A'
                  }
                </Label>
                <Label className="Label-profile">
                  <Icon name="image"/>
                  Images: {userProfile.noOfImgs}
                </Label>
              </CardContent>

              <Form
                onSubmit={this.onUpdateProfile}
                validate={this.onFormValidate}
                render={({handleSubmit, submitting, pristine}) => (
                <Modal
                  className="Modal-updateProfile"
                  open={profileUpdateOpen}
                  onClose={() => this.handleModalClose('profile')}
                  trigger={<Button onClick={() => this.handleModalOpen('profile')} className="Button-updateProfile">Update Profile</Button>}>
                  <Modal.Header>Update Profile</Modal.Header>
                  <Modal.Content image>
                    <Modal.Description>
                      <form className="form-updateUser" onSubmit={handleSubmit}>
                        <Grid>
                          <Field fullWidth required name="email" type="text"
                            render={({input, meta}) => (
                              <div className="div-inlineGrid">
                                <TextField
                                  label="Email" onChange={input.onChange} className={classes.textField}
                                  margin="normal" error={meta.submitFailed && !!meta.error} variant="outlined"
                                  InputProps={{
                                    startAdornment: (<InputAdornment position="start"><ContactMail /></InputAdornment>),
                                  }}
                                />
                                <span className="span-metaError">
                                  {meta.dirty ? meta.submitError :
                                    meta.modified ? meta.error : ""}
                                </span>
                              </div>
                            )}
                          />
                        </Grid>
                        <Grid>
                          <Field fullWidth required name="password"
                            render={({input, meta}) => (
                              <div className="div-inlineGrid">
                                <TextField type="password"
                                  label="Password" onChange={input.onChange} className={classes.textField}
                                  margin="normal" error={meta.submitFailed && !!meta.error} variant="outlined"
                                  InputProps={{
                                    startAdornment: (<InputAdornment position="start"><VpnKey /></InputAdornment>),
                                  }}
                                />
                                <span className="span-metaError">
                                  {meta.dirty ? meta.submitError :
                                    meta.modified ? meta.error : ""}
                                </span>
                              </div>
                            )}
                          />
                        </Grid>
                        <Grid>
                          <Field fullWidth required name="retypePassword"
                            render={({input, meta}) => (
                              <div className="div-inlineGrid">
                                <TextField
                                  label="Retype Password" type="password" onChange={input.onChange} className={classes.textField}
                                  margin="normal" error={meta.submitFailed && !!meta.error} variant="outlined"
                                  InputProps={{
                                    startAdornment: (<InputAdornment position="start"><VpnKey /></InputAdornment>),
                                  }}
                                />
                                <span className="span-metaError">
                                  {meta.dirty ? meta.submitError :
                                    meta.modified ? meta.error : ""}
                                </span>
                              </div>
                            )}
                          />
                        </Grid>
                        <Button className="Button-updateSubmit" type="submit">Update</Button>
                      </form>
                    </Modal.Description>
                  </Modal.Content>
                </Modal>
              )}
              />
            </div>
          }

        </Card>

        <Card className={classes.rightCard}>
          <Button.Group labeled icon className="ButtonGroup-profile">
            <Button onClick={() => this.changeRightTabContent('userActivity')} icon='braille' active={rightCardTab=='userActivity'} content='User Activity' />
            <Button onClick={() => this.changeRightTabContent('uploadedImgs')} icon='images outline' active={rightCardTab=='uploadedImgs'} content='Uploaded Images' />
          </Button.Group>

          { (rightCardTab == 'uploadedImgs') ?
            (
              <>
                <Divider horizontal>
                  <Header as='h4'>
                    <Icon name='images outline' />
                    Uploaded Images
                  </Header>
                </Divider>
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
                  {(data.length == 0) ?
                    <div className="div-noImage-placeholder">
                      <span className="span-noImages"><Icon name="images"/> No Images</span>
                    </div> : <Card className="Card-imgs">
                    <Grid columns={3} className="Grid-img-wrapper">
                      {
                        _map(data, (elem, idx) => {
                          const imgSrc = BASE_URL + elem.image_file
                          return (
                            <Grid.Column key={"GridCol-" + idx} onClick={() => this.handleModalOpen('uploadedImgs', imgSrc, elem)}>
                              <Card className="Card-img">
                                <Image className="Image-uploadedImgs" src={imgSrc}/>
                              </Card>
                            </Grid.Column>
                            )
                          }
                        )
                      }
                    </Grid>
                  </Card>}
                </div>
              </>
            ):
            (<>
              <Divider horizontal>
                <Header as='h4'>
                  <Icon name='braille' />
                  User Activity
                </Header>
              </Divider>
              <div className="div-calendarHeatmap-wrapper">
                <CalendarHeatmap
                  startDate={startDate}
                  endDate={endDate}
                  values={dateCountList}
                  classForValue={value => {
                    if(value.count == 0){
                      return `color-heatmap-0`
                    }else if(value.count <= 4 && value.count > 0){
                      return `color-heatmap-1`
                    }else if(value.count <= 8 && value.count > 4){
                      return `color-heatmap-2`
                    }else if(value.count <= 12 && value.count > 8){
                      return `color-heatmap-3`
                    }else if(value.count <= 16 && value.count > 12){
                      return `color-heatmap-4`
                    }else if(value.count > 16){
                      return `color-heatmap-5`
                    }
                  }}
                  showWeekdayLabels={true}
                  gutterSize={4}
                  tooltipDataAttrs={value => {
                    let tmpDate = new Date(value.date)
                    return {
                      'data-tip': `${tmpDate.toGMTString().split(", ")[1].slice(0,11)}` +
                      `<br/> Uploaded Images: ${value.count}`,
                    };
                  }}
                />
                <ReactTooltip multiline/>
              </div>
            </>)
          }
        </Card>
        <Modal
          className="Modal-updateImage"
          open={imgUpdateOpen}
          onClose={() => this.handleModalClose('uploadedImgs')}>
          <Modal.Header>Update Image</Modal.Header>
          <Modal.Content image>
            <Image wrapped size='medium' src={currImgSrc} />
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

const mapStateToProps = (state) => {
    return {
      lastRespMsg: state.userReducer.lastRespMsg,
      access: state.userReducer.access,
      isLogin: state.userReducer.isLogin,
      userId: state.userReducer.userId,
      userDetail: state.userReducer.userDetail,
      userProfile: state.userReducer.userProfile,
      userDtlFetched: state.userReducer.userDtlFetched,
      data: state.apiReducer.data,
      imgCount: state.apiReducer.imgCount,
      numPages: state.apiReducer.numPages,
      tags: state.apiReducer.tags
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
      getAuthUser, userLogout, upsertImage,
      getImages, updateAvatar, getTags,
      verifyJWTToken, startLoading,
      stopLoading, updateUser }, dispatch)
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(overrideStyles)(withSnackbar(ProfilePage))));
