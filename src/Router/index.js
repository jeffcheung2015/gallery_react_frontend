import React, { Component } from 'react';
import { Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { verifyJWTToken, getAuthUser } from "Reducer/User/UserActions";
import { startLoading, stopLoading } from "Reducer/UI/UIActions";
import { bindActionCreators } from 'redux';

import LoginPage from 'View/User/LoginPage';
import SignupPage from 'View/User/SignupPage';
import ProfilePage from 'View/User/ProfilePage';
import UploadPage from 'View/Gallery/UploadPage';
import HomePage from 'View/Gallery/HomePage';

//list of pages component to be mounted on the routes
import { routeName } from "Utils/Config/constants.js";

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
        {...rest}
        render={props =>
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
        }
      />
  )
}

const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
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
          <div>
            <Route path={routeName.HOME} exact component={HomePage} />
            <PublicRoute isLogin={isLogin} path={routeName.LOGIN} component={LoginPage} />
            <PublicRoute isLogin={isLogin} path={routeName.SIGNUP} component={SignupPage} />
            <PrivateRoute isLogin={isLogin} path={routeName.UPLOAD} exact component={UploadPage} />
            <PrivateRoute isLogin={isLogin} path={routeName.PROFILE} component={ProfilePage} />
          </div>
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
