import React, { Component } from 'react';
import "./index.scss"
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { compose } from 'recompose';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withStyles } from '@material-ui/styles';
import LoginForm from 'Components/UI/Forms/LoginForm';

const overrideStyles = () => ({
  loginPaper:{
    padding: '30px',
    marginBottom: '30px'
  },
  loginLabel: {
    fontSize: '26px',
    fontWeight: '600',
    textAlign: 'center',
    padding: '30px',
    background: '#a9a9a9'
  },
  loginLabelIcon: {
    width: '80px',
    height: '80px'
  },
  textField: {
    width: '100%',
    margin: '15px auto',
  },
  loginButton: {
    width: '100%',
    margin: '15px auto',
    padding: '10px',
    fontSize: '16px'
  }
})

class LoginPage extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    const {
      classes, startLoading, stopLoading, userLogin, enqueueSnackbar
    } = this.props

    return(
      <div className="div-loginPage-wrapper">
        <LoginForm
          startLoading={startLoading}
          stopLoading={stopLoading}
          userLogin={userLogin}
          classes={classes}
          enqueueSnackbar={enqueueSnackbar}
        />
      </div>
    )
  }
}
export default compose(
  withStyles(overrideStyles),
  withSnackbar
)(LoginPage);

LoginPage.protoTypes = {
  classes: PropTypes.bool.isRequired,
  access: PropTypes.string.isRequired,
  userDtlFetched: PropTypes.bool.isRequired,
  lastRespMsg: PropTypes.bool.isRequired,
  isLogin: PropTypes.bool.isRequired,
  userLogin:PropTypes.func.isRequired,
  startLoading:PropTypes.func.isRequired,
  stopLoading:PropTypes.func.isRequired,
}
