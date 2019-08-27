import React, { Component } from 'react';
import "./index.scss"
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Lock from '@material-ui/icons/Lock';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import VpnKey from '@material-ui/icons/VpnKey';
import { ReCaptcha } from 'react-recaptcha-google';
import Grid from '@material-ui/core/Grid';
import { Form, Field } from 'react-final-form'
import { withStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { userLogin } from "Reducer/User/UserActions";
import { respCodes, respCodeToMsg } from "Utils/Config/constants";
import { startLoading, stopLoading } from "Reducer/UI/UIActions";
import _forEach from 'lodash/forEach';
import _isEmpty from 'lodash/isEmpty';
import { withSnackbar } from 'notistack';


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
    this.state = {
    }
    this.capchaRef = null;
    this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onFormValidate = this.onFormValidate.bind(this);
    this.redirect = this.redirect.bind(this);
    this.handleSnackBar = this.handleSnackBar.bind(this);
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
    // Here you will get the final recaptchaToken!!!
    console.log(recaptchaToken, "<= your recaptcha token")
  }

  async onFormSubmit(formVals){
    console.log(">>> onFormSubmit, formVals: ", formVals)
    var submitErrorObj = {}
    // TBD: password len at least 6
    const { username, password } = formVals
    console.log(respCodeToMsg[this.props.lastRespMsg])
    this.props.startLoading()
    await this.props.userLogin(username, password,
      {
        onSuccess: () => this.handleSnackBar("Login successfully.", 'success'),
        onFail: (resp_code) => this.handleSnackBar(respCodeToMsg[resp_code], 'error')
      });
    this.props.stopLoading()
  }

  componentDidUpdate(){
    if(this.props.isLogin && this.props.userDtlFetched){
      console.log("Login page component componentDidUpdate redirect to home page")
      this.redirect("")
    }
  }

  onFormValidate(val){
    console.log('onFormValidate: ', val)
    const errorObj = {};
    _forEach(['username', 'password'], (e) => {
      if(!val[e]){
        errorObj[e] = 'Required field'
      }
    })
    // TBD: reCaptcha
    return errorObj;
  }

  render(){
    const {
      classes
    } = this.props

    return(
      <div className="div-loginPage-wrapper">
        <Form
          onSubmit={this.onFormSubmit}
          validate={this.onFormValidate}
          render={({handleSubmit, submitting}) => (
          <form className="form-loginPage" onSubmit={handleSubmit}>
            <Paper className={classes.loginPaper}>
              <Grid container>

                <Grid item xs={12} className={classes.loginLabel}>
                  <Lock className={classes.loginLabelIcon}/>
                </Grid>
                <Grid item xs={12}>
                  <Field
                    fullWidth
                    required
                    name="username"
                    type="text"
                    render={({input, meta}) => (
                      <div>
                        <TextField
                          label="Username"
                          onChange={input.onChange}
                          className={classes.textField}
                          margin="normal"
                          error={meta.submitFailed && !!meta.error}
                          variant="outlined"
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
                  <Field
                    fullWidth
                    required
                    name="password"
                    render={({input, meta})=>(
                      <div>
                        <TextField
                          label="Password"
                          type="password"
                          onChange={input.onChange}
                          className={classes.textField}
                          margin="normal"
                          error={meta.submitFailed && !!meta.error}
                          variant="outlined"
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

                <Grid item xs={12} className="div-recaptcha-container">
                  <div className="div-reCaptcha-innerContainer">
                    <ReCaptcha

                      ref={(el) => {this.capchaRef = el;}}
                      size="normal"
                      data-theme="dark"
                      render="explicit"
                      sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                      onloadCallback={this.onLoadRecaptcha}
                      verifyCallback={this.verifyCallback}
                    />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <Button className={classes.loginButton} variant="contained" color="primary" type="submit" disabled={submitting}>Login</Button>
                </Grid>
              </Grid>

            </Paper>
          </form>)
          }
        />
      </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(overrideStyles)(withSnackbar(LoginPage))));