import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/styles';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import "./index.scss";
import { compose } from 'recompose';

const overrideStyles = theme => ({
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
    zIndex: 10011
  },
  drawerHeader: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0 16px',
    minHeight: '45px',
    justifyContent: 'flex-start',
    background: '#FFFFFF'
  },
});

class SideDrawer extends React.Component{

  render(){
    const {
      classes, isDrawerOpen, handleDrawerAction, isLogin, isLoading, userDetail, userDtlFetched
    } = this.props

    return (!isLogin || isLoading || !userDtlFetched) ? (null) : (
      <>
        <div className={"div-drawerCover " + ((!isDrawerOpen) ? "div-hidden" : "")} onClick={handleDrawerAction}></div>
        <div className="div-sideDrawer-wrapper">

          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={isDrawerOpen}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}>
              <Avatar className={classes.avatar}>
                {userDetail.username[0]}
              </Avatar>
              <span className="span-username">{userDetail.username}</span>
            </div>
            <Divider />
            <List>

            </List>

          </Drawer>

        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => {
    return {
      userDtlFetched: state.userReducer.userDtlFetched,
      isLoading: state.uiReducer.isLoading,
      isLogin: state.userReducer.isLogin,
      userDetail: state.userReducer.userDetail
    };
};

export default compose(
  connect(mapStateToProps),
  withStyles(overrideStyles),
)(SideDrawer);

SideDrawer.protoTypes = {
  isLogin: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  userDtlFetched: PropTypes.bool.isRequired,
  userDetail: PropTypes.object,
}
