import React, { Component } from 'react';
import "./index.scss"
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Form } from 'react-final-form'
import TextFieldWithMsg from 'Components/UI/FormComponents/TextFieldWithMsg';
import PersonAdd from '@material-ui/icons/PersonAdd';
import { ReCaptcha } from 'react-recaptcha-google'
import { respCodes, respCodeToMsg } from "Utils/Config/constants";
import _forEach from 'lodash/forEach';
import _isEmpty from 'lodash/isEmpty';
import { isValidEmail } from 'Utils/UtilFunctions';


class SignupForm extends React.Component{
  constructor(props){
    super(props);
    this.capchaRef = null;
    this.state = {
      reCaptchaToken: ""
    }
    this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onFormValidate = this.onFormValidate.bind(this);
  }

  componentDidMount() {
    if (this.capchaRef) { this.capchaRef.reset(); }
  }

  onLoadRecaptcha() {
    if (this.capchaRef) { this.capchaRef.reset(); }
  }
  verifyCallback(recaptchaToken) {
    // the recaptcha token from google after sending the request
    console.log(recaptchaToken, "<= your recaptcha token")
    this.state.recaptchaToken = recaptchaToken
  }
  handleSnackBar(msg, variant){
    this.props.enqueueSnackbar(msg, {variant})
  }

  async onFormSubmit(formVals){
    console.log(">>> onFormSubmit: ", formVals)
    var submitErrorObj = {}
    const {password, confirmPassword, email, username} = formVals
    if(!!!this.state.recaptchaToken){
      submitErrorObj.recaptchaToken = "Recaptcha verification needs to be done."
      this.handleSnackBar("Recaptcha verification needs to be done.", 'warning')
    }
    if (password && confirmPassword && password != confirmPassword){
      submitErrorObj.password = "Password and Confirm Password field don't match.";
    }
    if(password && password.length < 8){
      submitErrorObj.password = "Password length must be greater than 8.";
    }
    if (email && !isValidEmail(email)){
      submitErrorObj.email = "Not a valid email."
    }
    if (!_isEmpty(submitErrorObj)){
      return submitErrorObj
    }
    this.props.startLoading()
    await this.props.userSignup(username, password, email, this.state.recaptchaToken, {
      onSuccess: () => this.handleSnackBar("Sign up successfully.", 'success'),
      onFail: (resp_code) => {
        this.handleSnackBar(respCodeToMsg[resp_code], 'error');
        this.capchaRef.reset();
      }
    })
    this.props.stopLoading()
    if (this.props.lastRespMsg === respCodes.SUCCESS_REQ){
      this.redirect("")
    }
  }

  onFormValidate(val){
    console.log('onFormValidate: ', val)
    const errorObj = {};
    _forEach(['username', 'email', 'password', 'confirmPassword'], (e) => {
      if(!val[e]){
        errorObj[e] = 'Required field'
      }
    })
    return errorObj;
  }

  render(){
    const {
      classes, userSignup, startLoading, stopLoading,
    } = this.props
    return(
      <Form
        onSubmit={this.onFormSubmit}
        validate={this.onFormValidate}
        render={({handleSubmit, submitting, pristine}) => (
        <form className="form-signupPage" onSubmit={handleSubmit}>
          <Paper className={classes.signupPaper}>
            <Grid container>
              <Grid item xs={12} className={classes.signupLabel}>
                <PersonAdd className={classes.signupLabelIcon}/>
              </Grid>
              <Grid item xs={12}>
                <TextFieldWithMsg
                  fieldName="username"
                  fieldType="text"
                  textFieldClassName={"TextFieldWithMsg-username " + classes.textField}
                  adornmentName="AccountCircle"
                  textFieldType="text"
                  textFieldLabel="Username"
                />
              </Grid>

              <Grid item xs={12}>
                <TextFieldWithMsg
                  fieldName="email"
                  fieldType="email"
                  textFieldClassName={"TextFieldWithMsg-email " + classes.textField}
                  adornmentName="ContactMail"
                  textFieldType="text"
                  textFieldLabel="Email"
                />
              </Grid>

              <Grid item xs={5}>
                <TextFieldWithMsg
                  fieldName="password"
                  fieldType="password"
                  textFieldClassName={"TextFieldWithMsg-password " + classes.textField}
                  adornmentName="VpnKey"
                  textFieldType="password"
                  textFieldLabel="Password"
                />
              </Grid>
              <Grid item xs={2}></Grid>
              <Grid item xs={5}>
                <TextFieldWithMsg
                  fieldName="confirmPassword"
                  fieldType="password"
                  textFieldClassName={"TextFieldWithMsg-confirmPassword " + classes.textField}
                  adornmentName="VpnKey"
                  textFieldType="password"
                  textFieldLabel="Confirm Password"
                />
              </Grid>

              <Grid item xs={8}>
                <div className="div-reCaptcha-container">
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

              <Grid item xs={4}>
                <Button className={classes.signupButton} variant="contained" color="primary" type="submit">Sign up</Button>
              </Grid>

            </Grid>
          </Paper>
        </form>
      )}
    />
    )
  }
}
export default SignupForm;

SignupForm.protoTypes = {
  classes: PropTypes.object.isRequired,
  userSignup: PropTypes.func.isRequired,
  startLoading: PropTypes.func.isRequired,
  stopLoading: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
}
