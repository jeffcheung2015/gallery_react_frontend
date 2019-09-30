import React, { Component } from 'react';
import "./index.scss"
import { pure } from 'recompose';
import Loader from 'react-loaders'
import PropTypes from 'prop-types';
import VpnKey from '@material-ui/icons/VpnKey';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ContactMail from '@material-ui/icons/ContactMail';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { Field } from 'react-final-form'


const TextFieldWithMsg = (props) => {
  const {
    onChange,
    fieldName, fieldType, textFieldClassName, adornmentName, textFieldType, textFieldLabel
  } = props
  let adornmentComp = {
    "VpnKey": <VpnKey/>,
    "AccountCircle": <AccountCircle />,
    "ContactMail": <ContactMail />,
  }
  return (
    <Field fullWidth required name={fieldName} type={fieldType}
      render={({input, meta}) => (
        <div>
          <TextField label={textFieldLabel}
            type={textFieldType}
            onChange={input.onChange}
            variant="outlined"
            className={textFieldClassName}
            margin="normal"
            error={meta.submitFailed && !!meta.error}
            InputProps={{
              startAdornment: (<InputAdornment position="start">{adornmentComp[adornmentName]}</InputAdornment>),
            }}
          />
          <span className="span-metaError">
            {meta.modified ? meta.submitError :
              meta.dirty ? meta.error : ""}
          </span>
        </div>
      )}
    />
  );
}
export default pure(TextFieldWithMsg);

TextFieldWithMsg.propTypes = {
  fieldName: PropTypes.string.isRequired,
  fieldType: PropTypes.string.isRequired,
  textFieldClassName: PropTypes.string,
  adornmentName: PropTypes.string.isRequired,
  textFieldType: PropTypes.string.isRequired,
  textFieldLabel: PropTypes.string.isRequired,

}
