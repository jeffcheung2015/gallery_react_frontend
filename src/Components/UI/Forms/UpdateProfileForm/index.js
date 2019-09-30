import React, { Component } from 'react';
import "./index.scss"
import { pure } from 'recompose';
import { Form, Field } from 'react-final-form'
import PropTypes from 'prop-types';
import { Modal, Grid, Button } from 'semantic-ui-react'
import TextFieldWithMsg from 'Components/UI/FormComponents/TextFieldWithMsg';
import _isEmpty from 'lodash/isEmpty'
import _forEach from 'lodash/forEach';
import { respCodes, respCodeToMsg } from "Utils/Config/constants";
import { isValidEmail } from 'Utils/UtilFunctions';

class UpdateProfileForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      profileUpdateOpen: false
    }
    this.onUpdateProfile = this.onUpdateProfile.bind(this);
    this.onFormValidate = this.onFormValidate.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this)
    this.handleModalClose = this.handleModalClose.bind(this)
  }

  handleModalClose(){
    this.setState({profileUpdateOpen: false})
  }
  handleModalOpen(){
    this.setState({profileUpdateOpen: true})
  }

  onFormValidate(val){
    console.log('>>> onFormValidate: ', val)
    const errorObj = {};
    _forEach(['email', 'password', 'retypePassword'], (e) => {
      if(!val[e]){
        errorObj[e] = 'Required field'
      }
    })
    return errorObj;
  }

  async onUpdateProfile(formVals){
    console.log(">>> onUpdateProfile.formVals:", formVals)
    var submitErrorObj = {}
    const {password, retypePassword, email} = formVals
    if(password && password != retypePassword || !!!password || !!!retypePassword){
      submitErrorObj.password = "Password and Retype Password field don't match.";
    }
    if(password && password.length < 8 || !!!password){
      submitErrorObj.password = "Password length must be greater than 8.";
    }
    if (email && !isValidEmail(email) || !!!email){
      submitErrorObj.email = "Not a valid email."
    }
    if (!_isEmpty(submitErrorObj)){
      return submitErrorObj
    }

    this.props.startLoading()

    var formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)

    await this.props.updateUser(formData, this.props.access, {
      onSuccess: () => this.props.handleSnackBar("Update user successfully.", 'success'),
      onFail: (resp_code) => this.props.handleSnackBar(respCodeToMsg[resp_code], 'error')
    })
    if (this.props.lastRespMsg === respCodes.SUCCESS_REQ){
      // update the updated profile by calling getUser again
      await this.props.getAuthUser(this.props.access)

      this.handleModalClose('profile')
    }
    this.props.stopLoading()
  }

  render(){
    const {
      profileUpdateOpen
    } = this.state

    return (
      <div className="div-updateProfileForm-wrapper">
        <Button onClick={() => this.handleModalOpen()} className="Button-updateProfile">Update Profile</Button>
        <Form
          onSubmit={this.onUpdateProfile}
          validate={this.onFormValidate}
          render={({handleSubmit, submitting, pristine}) => (
          <Modal
            className="Modal-updateProfile"
            open={profileUpdateOpen}
            onClose={() => this.handleModalClose()}>
            <Modal.Header>Update Profile</Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <form className="form-updateUser" onSubmit={handleSubmit}>
                  <Grid>
                    <TextFieldWithMsg
                      textFieldClassName="TextFieldWithMsg-email"
                      fieldName="email"
                      fieldType="text"
                      adornmentName="ContactMail"
                      textFieldType="text"
                      textFieldLabel="Email"
                    />
                  </Grid>
                  <Grid>
                    <TextFieldWithMsg
                      textFieldClassName="TextFieldWithMsg-password"
                      fieldName="password"
                      fieldType="password"
                      adornmentName="VpnKey"
                      textFieldType="password"
                      textFieldLabel="Password"
                    />
                  </Grid>
                  <Grid>
                    <TextFieldWithMsg
                      textFieldClassName="TextFieldWithMsg-retypePassword"
                      fieldName="retypePassword"
                      fieldType="password"
                      adornmentName="VpnKey"
                      textFieldType="password"
                      textFieldLabel="Retype Password"
                    />
                  </Grid>
                  <Button className="Button-updateProfile-submit" type="submit">Update</Button>
                </form>
              </Modal.Description>
            </Modal.Content>
          </Modal>
        )}
        />
      </div>
    );
  }
}
export default UpdateProfileForm

UpdateProfileForm.propTypes = {
  lastRespMsg: PropTypes.string.isRequired,
  access: PropTypes.string.isRequired,
  updateUser: PropTypes.func.isRequired,
  getAuthUser: PropTypes.func.isRequired,
  startLoading: PropTypes.func.isRequired,
  stopLoading: PropTypes.func.isRequired,
  handleSnackBar: PropTypes.func.isRequired,
}
