import React, { Component } from 'react';
import "./index.scss"
import { withStyles } from '@material-ui/styles';
import Update from '@material-ui/icons/Update';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Loader from 'react-loaders'
import _isEmpty from 'lodash/isEmpty'
import _map from 'lodash/map';
import { respCodes } from "Utils/Config/constants";
import CardActionArea from '@material-ui/core/CardActionArea';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { isValidEmail } from 'Utils/UtilFunctions';
import { Button, Header, Pagination, Icon, Image, Modal,
   Label, Grid, Dropdown, Input } from 'semantic-ui-react'
import VpnKey from '@material-ui/icons/VpnKey';
import { compose } from 'recompose';
import IconButtonTab from 'Components/UI/IconButtonTab';
import CalendarHeatmapActivity from 'Components/UI/CalendarHeatmapActivity';
import UpdateProfileForm from 'Components/UI/Forms/UpdateProfileForm';
import ProfileUploadedImages from 'Components/UI/ProfileUploadedImages';
import UpdateAvatarForm from 'Components/UI/Forms/UpdateAvatarForm'

const overrideStyles = (theme) => ({
  leftCard:{
    width: "300px",
    minHeight: "500px"
  },
  leftCardContent:{
    paddingLeft: "0px",
  },
  rightCard:{
    width: "600px",
    minHeight: "550px",
    marginLeft: "20px"
  },
});

class ProfilePage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      currPage: 1,
      imgPerPage: '6',
      rightCardTab: 0,
    }
    this.redirect = this.redirect.bind(this)
    this.handleSnackBar = this.handleSnackBar.bind(this)
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
    //user restricted area, to avoid access without valid jwt token user access this page
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
      this.redirect("")
      this.props.stopLoading()
    }
  }

  handleSnackBar(msg, variant){
    this.props.enqueueSnackbar(msg, {variant})
  }



  changeRightTabContent(contentType){
    this.setState({
      rightCardTab: contentType
    })
  }

  render(){
    const {
      userDetail, userProfile, isLogin, classes, userId, userDtlFetched,
      data, imgCount, numPages, tags, lastRespMsg, access, updateUser, getAuthUser,
      startLoading, stopLoading, getImages, getTags, upsertImage, updateAvatar,
    } = this.props

    const {
      rightCardTab
    } = this.state


    let userProfileInfoLabels = _map([
      {text: `Username: ${userDetail.username}`, iconName: "user"},
      {text: `User ID: ${userId}`, iconName: "info"},
      {text: `Email: ${userDetail.email}`, iconName: "mail"},
      {text: `Joined In: ${moment(new Date(userDetail.createdAt)).format("MM-DD-YYYY")}`, iconName: "add to calendar"},
      {text: `Last Login: ${moment(new Date(userDetail.lastLoginAt)).format("MM-DD-YYYY HH:mm A")}`, iconName: "sign-in"},
      {text: `Last Update: ${!userProfile.lastProfileEdit ? 'N/A' :
        moment(new Date(userProfile.lastProfileEdit)).format("MM-DD-YYYY HH:mm A")
      }`, iconName: "undo"},
      {text: `Images: ${userProfile.noOfImgs}`, iconName: "image"}
    ], (elem) => elem)

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
                <UpdateAvatarForm
                  lastRespMsg={lastRespMsg}
                  updateAvatar={updateAvatar}
                  getAuthUser={getAuthUser}
                  classes={classes}
                  access={access}
                  startLoading={startLoading}
                  stopLoading={stopLoading}
                  userProfile={userProfile}
                  handleSnackBar={this.handleSnackBar}
                />


              </CardActionArea>

              <CardContent className={classes.leftCardContent}>
                {
                  _map(userProfileInfoLabels, (elem, idx)=>{
                    return (
                      <Label className="Label-profile" key={`Label-profile-${idx}`}>
                        <Icon name={elem.iconName}/>
                        {elem.text}
                      </Label>
                    )
                  })
                }
              </CardContent>

              <UpdateProfileForm
                lastRespMsg={lastRespMsg}
                access={access}
                updateUser={updateUser}
                getAuthUser={getAuthUser}
                startLoading={startLoading}
                stopLoading={stopLoading}
                handleSnackBar={this.handleSnackBar}
              />
            </div>
          }

        </Card>

        <Card className={classes.rightCard}>
          <IconButtonTab
            updateTabIdx={this.changeRightTabContent}
            onClickList={[
              { icon: "braille", content: 'User Activity' },
              { icon: "images outline", content: 'Uploaded Images' }
            ]}
          />

          { (rightCardTab == 1) ?
            <ProfileUploadedImages
              userId={userId}
              data={data}
              lastRespMsg={lastRespMsg}
              tags={tags}
              getTags={getTags}
              startLoading={startLoading}
              stopLoading={stopLoading}
              upsertImage={upsertImage}
              getImages={getImages}
              access={access}
              getAuthUser={getAuthUser}
              numPages={numPages}
              handleSnackBar={this.handleSnackBar}
            />:
            (<CalendarHeatmapActivity
              activity={userProfile.activity}
            />)
          }
        </Card>

      </div>
    )
  }
}
export default compose(
  withStyles(overrideStyles),
  withSnackbar
)(ProfilePage);

ProfilePage.protoTypes = {
  classes: PropTypes.object,

  lastRespMsg: PropTypes.string.isRequired,
  access: PropTypes.string.isRequired,
  isLogin:PropTypes.bool.isRequired,
  userId: PropTypes.number,
  userDetail: PropTypes.object,
  userProfile: PropTypes.object,
  userDtlFetched: PropTypes.bool.isRequired,
  data: PropTypes.arrayOf({
    created_at: PropTypes.string,
    id:PropTypes.number,
    image_desc:PropTypes.string,
    image_file:PropTypes.string,
    image_name:PropTypes.string,
    last_edit:PropTypes.string,
    tags:PropTypes.arrayOf(PropTypes.number),
    user:PropTypes.number,
  }),
  imgCount: PropTypes.number.isRequired,
  numPages: PropTypes.number.isRequired,
  tags: PropTypes.arrayOf(PropTypes.number).isRequired,

  getAuthUser: PropTypes.func.isRequired,
  userLogout: PropTypes.func.isRequired,
  upsertImage: PropTypes.func.isRequired,
  getImages: PropTypes.func.isRequired,
  updateAvatar: PropTypes.func.isRequired,
  getTags: PropTypes.func.isRequired,
  verifyJWTToken: PropTypes.func.isRequired,
  startLoading: PropTypes.func.isRequired,
  stopLoading: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
}
