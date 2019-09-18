import React, { Component } from 'react';
import "./index.scss"
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PersonAdd from '@material-ui/icons/PersonAdd';
import InputAdornment from '@material-ui/core/InputAdornment';
import ContactMail from '@material-ui/icons/ContactMail';
import AccountCircle from '@material-ui/icons/AccountCircle';
import VpnKey from '@material-ui/icons/VpnKey';
import { ReCaptcha } from 'react-recaptcha-google'
import Grid from '@material-ui/core/Grid';
import { Form, Field } from 'react-final-form'
import { isValidEmail } from 'Utils/UtilFunctions';
import { withStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { userSignup } from "Reducer/User/UserActions";
import { respCodes, respCodeToMsg } from "Utils/Config/constants";
import _forEach from 'lodash/forEach';
import _isEmpty from 'lodash/isEmpty';
import { withSnackbar } from 'notistack';
import { startLoading, stopLoading } from "Reducer/UI/UIActions";
import PropTypes from 'prop-types';

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
    this.capchaRef = null;
    this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onFormValidate = this.onFormValidate.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  redirect(path) {
    this.props.history.push(path);
  }

  handleSnackBar(msg, variant){
    this.props.enqueueSnackbar(msg, {variant})
  }

  componentDidMount() {
    if (this.capchaRef) {
        this.capchaRef.reset();
        // this.capchaRef.execute();
    }
  }

  onLoadRecaptcha() {
      if (this.capchaRef) {
          this.capchaRef.reset();
      }
  }

  verifyCallback(recaptchaToken) {
    // the recaptcha token from google after sending the request
    console.log(recaptchaToken, "<= your recaptcha token")
    this.state.recaptchaToken = recaptchaToken
  }



  async onFormSubmit(formVals){
    console.log(">>> onFormSubmit: ", formVals)
    var submitErrorObj = {}
    const {password, confirmPassword, email, username} = formVals
    if(!!!this.state.recaptchaToken){
      submitErrorObj.recaptchaToken = "Recaptcha verification needs to be done."
      this.handleSnackBar("Recaptcha verification needs to be done.", 'warning')
    }
    if (password != confirmPassword){
      submitErrorObj.password = "Password and Confirm Password field don't match.";
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

    // TBD: reCaptcha
    return errorObj;
  }

  componentDidUpdate(){
    if(this.props.isLogin){
      this.redirect("")
    }
  }

  render(){
    const {
      classes, lastRespMsg
    } = this.props


    return(
      <div className="div-signupPage-wrapper">
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
                  <Field fullWidth required name="username" type="text"
                    render={({input, meta}) => (
                      <div>
                        <TextField label="Username" onChange={input.onChange} className={classes.textField}
                          margin="normal" error={meta.submitFailed && !!meta.error} variant="outlined"
                          InputProps={{
                            startAdornment: (<InputAdornment position="start"><AccountCircle /></InputAdornment>),
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

                <Grid item xs={12}>
                  <Field fullWidth required name="email" type="email"
                    render={({input, meta}) => (
                      <div>
                        <TextField label="Email" onChange={input.onChange} className={classes.textField}
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

                <Grid item xs={5}>
                  <Field fullWidth required name="password"
                    render={({input, meta})=>(
                      <div>
                        <TextField label="Password" type="password" onChange={input.onChange} variant="outlined"
                          className={classes.textField} margin="normal" error={meta.submitFailed && !!meta.error}
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
                <Grid item xs={2}></Grid>
                <Grid item xs={5}>
                  <Field fullWidth required name="confirmPassword"
                    render={({input, meta})=>(
                      <div>
                        <TextField label="Confirm Password" type="password" onChange={input.onChange} variant="outlined"
                          className={classes.textField} margin="normal" error={meta.submitFailed && !!meta.error}
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
    </div>)
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


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(overrideStyles)(withSnackbar(SignupPage))));

SignupPage.protoTypes = {
  classes: PropTypes.object,
  isLogin: PropTypes.bool.isRequired,
  lastRespMsg: PropTypes.string.isRequired,

  userSignup: PropTypes.func.isRequired,
  startLoading: PropTypes.func.isRequired,
  stopLoading: PropTypes.func.isRequired,
}
