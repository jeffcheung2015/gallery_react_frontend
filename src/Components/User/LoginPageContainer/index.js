import React, { Component } from 'react';
import LoginPage from './LoginPage';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { userLogin } from "Reducer/User/UserActions";
import { startLoading, stopLoading } from "Reducer/UI/UIActions";
import PropTypes from 'prop-types';
import { compose } from 'recompose';


class LoginPageContainer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
    }
    this.redirect = this.redirect.bind(this);
  }

  redirect(path) {
    this.props.history.push(path);
  }

  componentDidUpdate(){
    if(this.props.isLogin && this.props.userDtlFetched){
      console.log("Login page component componentDidUpdate redirect to home page")
      this.redirect("")
    }
  }

  render(){

    return(
      <LoginPage
        {...this.props}
      />
    )
  }
}

const mapStateToProps = (state) => {
    return {
      userDtlFetched: state.userReducer.userDtlFetched,
      access: state.userReducer.access,
      lastRespMsg: state.userReducer.lastRespMsg,
      isLogin: state.userReducer.isLogin,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
      userLogin, startLoading, stopLoading }, dispatch)
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(LoginPageContainer);

LoginPageContainer.protoTypes = {
  classes: PropTypes.bool.isRequired,
  access: PropTypes.string.isRequired,
  userDtlFetched: PropTypes.bool.isRequired,
  lastRespMsg: PropTypes.bool.isRequired,
  isLogin: PropTypes.bool.isRequired,
  userLogin:PropTypes.func.isRequired,
  startLoading:PropTypes.func.isRequired,
  stopLoading:PropTypes.func.isRequired,
}
