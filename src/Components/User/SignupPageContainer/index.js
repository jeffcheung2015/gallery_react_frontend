import React, { Component } from 'react';
import "./index.scss"
import SignupPage from './SignupPage';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { userSignup } from "Reducer/User/UserActions";
import { startLoading, stopLoading } from "Reducer/UI/UIActions";
import PropTypes from 'prop-types';
import { compose } from 'recompose';


class SignupPageContainer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
    }
    this.redirect = this.redirect.bind(this);
  }

  redirect(path) {
    this.props.history.push(path);
  }

  render(){
    return(
      <SignupPage
        {...this.props}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isLogin: state.userReducer.isLogin,
    lastRespMsg: state.userReducer.lastRespMsg
  };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ userSignup, startLoading, stopLoading }, dispatch)
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SignupPageContainer);

SignupPageContainer.protoTypes = {
  classes: PropTypes.object,
  isLogin: PropTypes.bool.isRequired,
  lastRespMsg: PropTypes.string.isRequired,

  userSignup: PropTypes.func.isRequired,
  startLoading: PropTypes.func.isRequired,
  stopLoading: PropTypes.func.isRequired,
}
