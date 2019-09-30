import React, { Component } from 'react';
import "./index.scss"
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form'
import { ReCaptcha } from 'react-recaptcha-google';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextFieldWithMsg from 'Components/UI/FormComponents/TextFieldWithMsg';
import Lock from '@material-ui/icons/Lock';
import Button from '@material-ui/core/Button';
import _isEmpty from 'lodash/isEmpty';
import { respCodes, respCodeToMsg } from "Utils/Config/constants";
import _forEach from 'lodash/forEach';


class LoginForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      recaptchaToken: ""
    }
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onFormValidate = this.onFormValidate.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
    this.handleSnackBar = this.handleSnackBar.bind(this);
  }
  handleSnackBar(msg, variant){
    this.props.enqueueSnackbar(msg, {variant})
  }

  componentDidMount() {
    if (this.capchaRef) { this.capchaRef.reset(); }
  }

  onLoadRecaptcha() {
    if (this.capchaRef) { this.capchaRef.reset(); }
  }

  verifyCallback(recaptchaToken) {
    this.state.recaptchaToken = recaptchaToken
  }

  async onFormSubmit(formVals){
    console.log(">>> onFormSubmit, formVals: ", formVals)
    var submitErrorObj = {}
    const { username, password } = formVals
    if(!!!this.state.recaptchaToken){
      submitErrorObj.recaptchaToken = "Recaptcha verification needs to be done."
      this.handleSnackBar("Recaptcha verification needs to be done.", 'warning')
    }
    if(password && password.length < 8){
      submitErrorObj.password = "Password length must be greater than 8.";
    }
    if (!_isEmpty(submitErrorObj)){
      return submitErrorObj
    }
    this.props.startLoading()
    await this.props.userLogin(username, password, this.state.recaptchaToken,
      {
        onSuccess: () => this.handleSnackBar("Login successfully.", 'success'),
        onFail: (resp_code) => {
          this.handleSnackBar(respCodeToMsg[resp_code], 'error');
          this.capchaRef.reset();
        }
      });
    this.props.stopLoading()
  }

  onFormValidate(val){
    console.log('onFormValidate: ', val)
    const errorObj = {};
    _forEach(['username', 'password'], (e) => {
      if(!val[e]){
        errorObj[e] = 'Required field'
      }
    })
    return errorObj;
  }

  render(){
    const {
      classes, startLoading, stopLoading, userLogin,
    } = this.props
    return(
      <Form
        onSubmit={this.onFormSubmit}
        validate={this.onFormValidate}
        render={({handleSubmit, form, submitting}) => (
          <form className="form-loginPage" onSubmit={handleSubmit}>
            <Paper className={classes.loginPaper}>
              <Grid container>
                <Grid item xs={12} className={classes.loginLabel}>
                  <Lock className={classes.loginLabelIcon}/>
                </Grid>
                <Grid item xs={12}>
                  <TextFieldWithMsg
                    fieldName="username"
                    fieldType="text"
                    textFieldClassName={classes.textField}
                    adornmentName="AccountCircle"
                    textFieldType="text"
                    textFieldLabel="Username"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextFieldWithMsg
                    fieldName="password"
                    fieldType="password"
                    textFieldClassName={classes.textField}
                    adornmentName="VpnKey"
                    textFieldType="password"
                    textFieldLabel="Password"
                  />
                </Grid>

                <Grid item xs={12} className="div-recaptcha-container">
                  <div className="div-reCaptcha-innerContainer">
                    <ReCaptcha
                      ref={(el) => {this.capchaRef = el;}}
                      size="normal"
                      data-theme="dark"
                      render="explicit"
                      sitekey={process.env.REACT_APP_GOOGLE_RECAPCHA_KEY_SITE_KEY}
                      onloadCallback={this.onLoadRecaptcha}
                      verifyCallback={this.verifyCallback}
                    />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <Button className={`Button-login ` + classes.loginButton}
                    variant="contained" color="primary" type="submit"
                    disabled={submitting}>Login</Button>
                </Grid>
              </Grid>

            </Paper>
          </form>
        )
      }/>
    )
  }
}
export default LoginForm;

LoginForm.protoTypes = {
  classes : PropTypes.object.isRequired,
  startLoading : PropTypes.func.isRequired,
  stopLoading : PropTypes.func.isRequired,
  userLogin : PropTypes.func.isRequired,
  handleSnackBar : PropTypes.func.isRequired,
}
