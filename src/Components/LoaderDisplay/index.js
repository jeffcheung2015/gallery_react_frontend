import React, { Component } from 'react';
import "./index.scss"
import { pure } from 'recompose';
import Loader from 'react-loaders'

const LoaderDisplay = (props) => {


  return (
    <div className="div-loaderDisplay-wrapper">
      <div className="div-loaderDisplay-cover"></div>
      <div className="div-loader-wrapper">

        <Loader
          type="line-scale-pulse-out-rapid"
          color="#000000"
          active
        />


      </div>
    </div>
  );
}
export default pure(LoaderDisplay);
