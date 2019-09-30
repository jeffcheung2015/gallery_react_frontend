import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { getImages, getTags } from 'Reducer/API/APIActions';
import { startLoading, stopLoading } from 'Reducer/UI/UIActions';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import HomePage from './HomePage';


class HomePageContainer extends React.Component{

  constructor(props){
    super(props)
    this.state = {
    }

  }

  render(){
    return (
      <HomePage
        {...this.props}
      />
    )
  }
}

const mapStateToProps = (state) => {
    return {
      isLoading: state.uiReducer.isLoading,
      userId: state.userReducer.userId,
      lastRespMsg: state.apiReducer.lastRespMsg,
      data: state.apiReducer.data,
      imgCount: state.apiReducer.imgCount,
      numPages: state.apiReducer.numPages,
      currPage: state.apiReducer.currPage,
      tags: state.apiReducer.tags
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({startLoading, stopLoading, getImages, getTags}, dispatch)
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(HomePageContainer);


HomePageContainer.protoTypes = {
  isLoading: PropTypes.bool.isRequired,
  userId: PropTypes.number,
  lastRespMsg: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    created_at: PropTypes.string,
    id:PropTypes.number,
    image_desc:PropTypes.string,
    image_file:PropTypes.string,
    image_name:PropTypes.string,
    last_edit:PropTypes.string,
    tags:PropTypes.arrayOf(PropTypes.number),
    user:PropTypes.number,
  })).isRequired,
  imgCount:PropTypes.number.isRequired,
  numPages:PropTypes.number.isRequired,
  currPage:PropTypes.number.isRequired,
  tags:PropTypes.arrayOf(PropTypes.number).isRequired,
}
