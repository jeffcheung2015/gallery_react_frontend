import React, { Component } from 'react';
import "./index.scss"
import ProfilePage from './ProfilePage';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAuthUser, verifyJWTToken, userLogout } from "Reducer/User/UserActions";
import { bindActionCreators } from 'redux';
import { updateAvatar, updateUser } from 'Reducer/User/UserActions';
import { startLoading, stopLoading } from 'Reducer/UI/UIActions';
import { getImages, upsertImage, getTags } from 'Reducer/API/APIActions';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

class ProfilePageContainer extends React.Component{
  constructor(props){
    super(props)
    this.state = {
    }
  }
  render(){
    return (
      <ProfilePage
        {...this.props}
      />
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

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ProfilePageContainer);


ProfilePageContainer.protoTypes = {
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
  isLogin: PropTypes.bool.isRequired,

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
}
