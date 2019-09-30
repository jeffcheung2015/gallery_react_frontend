import React, { Component } from 'react';
import "./index.scss"
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { compose } from 'recompose';
import SignupForm from 'Components/UI/Forms/SignupForm';

const overrideStyles = () => ({
  signupPaper:{
    padding: '30px',
    marginBottom: "30px"
  },
  signupLabel: {
    fontSize: '26px',
    fontWeight: '600',
    textAlign: 'center',
    padding: '30px',
    background: '#a9a9a9'
  },
  signupLabelIcon: {
    width: '80px',
    height: '80px'
  },
  textField: {
    width: '100%',
    margin: '15px auto',
  },
  signupButton: {
    width: '100%',
    margin: '15px auto',
    padding: '10px',
    fontSize: '16px'
  }
})

class SignupPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render(){
    const {
      classes, lastRespMsg, enqueueSnackbar, startLoading, stopLoading, userSignup,
    } = this.props

    return(
      <div className="div-signupPage-wrapper">
        <SignupForm
          classes={classes}
          enqueueSnackbar={enqueueSnackbar}
          userSignup={userSignup}
          startLoading={startLoading}
          stopLoading={stopLoading}
        />
      </div>
    )
  }
}

export default compose(
  withStyles(overrideStyles),
  withSnackbar
)(SignupPage);

SignupPage.protoTypes = {
  classes: PropTypes.object,
  isLogin: PropTypes.bool.isRequired,
  lastRespMsg: PropTypes.string.isRequired,

  userSignup: PropTypes.func.isRequired,
  startLoading: PropTypes.func.isRequired,
  stopLoading: PropTypes.func.isRequired,
}
