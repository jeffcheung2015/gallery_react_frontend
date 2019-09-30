import React, { Component } from 'react';
import "./index.scss"
import UploadPage from './UploadPage';
import { connect } from 'react-redux';
import { upsertImage } from "Reducer/API/APIActions";
import { bindActionCreators } from 'redux';
import { startLoading, stopLoading } from "Reducer/UI/UIActions";
import { verifyJWTToken, userLogout } from "Reducer/User/UserActions";
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import _map from 'lodash/map';

class UploadPageContainer extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
      <UploadPage
        {...this.props}
      />
    )
  }
}
const mapStateToProps = (state) => {
    return {
      lastRespMsg: state.apiReducer.lastRespMsg,
      tags: state.apiReducer.tags,
      isLogin: state.userReducer.isLogin,
      access: state.userReducer.access
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ upsertImage, verifyJWTToken,
       startLoading, stopLoading, userLogout }, dispatch)
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),

)(UploadPageContainer);

UploadPageContainer.protoTypes = {

}
