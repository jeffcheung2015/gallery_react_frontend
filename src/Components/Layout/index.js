import React, { Component } from 'react';
import "./index.scss"
import 'semantic-ui-css/semantic.min.css'
import GlobalHeader from 'Components/Layout/GlobalHeader';
import GlobalFooter from 'Components/Layout/GlobalFooter';
import Router from 'Router';
import { getTags } from 'Reducer/API/APIActions';
import LoaderDisplay from 'Components/UI/LoaderDisplay';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { startLoading, stopLoading } from 'Reducer/UI/UIActions';
import PropTypes from 'prop-types';

class Layout extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      isDrawerOpen: false,
    }
    this.handleDrawerAction = this.handleDrawerAction.bind(this)

  }

  async componentDidMount(){
    this.props.startLoading()

    await this.props.getTags()

    this.props.stopLoading()
  }

  handleDrawerAction(){
    this.setState({
      isDrawerOpen: !this.state.isDrawerOpen
    })
  }

  render(){
    const {
      isDrawerOpen,
    } = this.state

    const {
      isLoading
    } = this.props
    return(
      <div className="div-layout-wrapper">
        <GlobalHeader isDrawerOpen={isDrawerOpen} handleDrawerAction={this.handleDrawerAction}/>
        <div className={isLoading ? "full-opacity" : "full-transparents"}>
          <LoaderDisplay />
        </div>
        <div className={"div-layoutContent-wrapper " + ((isDrawerOpen) ? "div-collapsed" : "")}>
          <Router />
        </div>
        <GlobalFooter />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isLogin: state.userReducer.isLogin,
    isLoading: state.uiReducer.isLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ startLoading, stopLoading, getTags }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);

Layout.protoTypes = {
  isLogin: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  startLoading: PropTypes.func.isRequired,
  stopLoading: PropTypes.func.isRequired,
  getTags: PropTypes.func.isRequired,

}
