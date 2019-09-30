import React, { Component } from 'react';
import "./index.scss"
import PropTypes from 'prop-types';
import { pure } from 'recompose';

const NotFoundPage = () => {
  
  return(
    <div className="div-NotFoundPage-wrapper">
      <span>404 not found</span>
    </div>
  )
}
export default pure(NotFoundPage)

NotFoundPage.protoTypes = {
}
