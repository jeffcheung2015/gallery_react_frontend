import React, { Component } from 'react';
import { Route, Redirect, Switch } from "react-router-dom";

import { connect } from 'react-redux';
import { verifyJWTToken, getAuthUser } from "Reducer/User/UserActions";
import { startLoading, stopLoading } from "Reducer/UI/UIActions";
import { bindActionCreators } from 'redux';

import LoginPageContainer from 'Components/User/LoginPageContainer';
import SignupPageContainer from 'Components/User/SignupPageContainer';
import ProfilePageContainer from 'Components/User/ProfilePageContainer';
import UploadPageContainer from 'Components/Gallery/UploadPageContainer';
import HomePageContainer from 'Components/Gallery/HomePageContainer';

import NotFoundPage from 'Components/Layout/NotFoundPage';

//list of pages component to be mounted on the routes
import { routeName } from "Utils/Config/constants.js";

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
        {...rest}
        render={props => {
          return (
            rest.isLogin ? (
              <Component {...props} />
            ) : (
              <Redirect
                to={{
                  pathname: routeName.LOGIN,
                  state: { from: props.location }
                }}
              />
            )
          )
        }}
      />
  )
}

const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>{
        return (
          rest.isLogin ? (
            <Redirect
              to={{
                pathname: routeName.PROFILE,
                state: { from: props.location }
              }}
            />
          ) : (
            <Component {...props} />
          )
        )
      }
      }
    />
  )
}

class Router extends Component {
  constructor(props){
    super(props);
    this.state={
    };
  }

  async componentDidMount(){

    this.props.startLoading()
    const access = localStorage.getItem("access")
    const refresh = localStorage.getItem("refresh")
    //first verify the existing tokens validity
    await this.props.verifyJWTToken(access, refresh)

    if (this.props.isLogin){
      //wait until the verification ended, and if the current state is logged on then get the corresponding user
      await this.props.getAuthUser(access)
    }
    this.props.stopLoading()
  }

  render() {
    const {
      isLogin
    } = this.props
    return (
      <div>
        {(
          <Switch>
            <Route path={routeName.HOME} exact component={HomePageContainer} />
            <PublicRoute isLogin={isLogin} path={routeName.LOGIN} component={LoginPageContainer} />
            <PublicRoute isLogin={isLogin} path={routeName.SIGNUP} component={SignupPageContainer} />
            <PrivateRoute isLogin={isLogin} path={routeName.UPLOAD} component={UploadPageContainer} />
            <PrivateRoute isLogin={isLogin} path={routeName.PROFILE} component={ProfilePageContainer} />
            <Route component={NotFoundPage} />
          </Switch>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
    return {
      isLogin: state.userReducer.isLogin,
    };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({verifyJWTToken, getAuthUser, startLoading, stopLoading}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Router);
