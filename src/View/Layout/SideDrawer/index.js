import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Fab from '@material-ui/core/Fab';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';

import "./index.scss";

const overrideStyles = theme => ({
  avatar: {

  },
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
    minHeight: '64px',
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

const mapDispatchToProps = (dispatch) => {
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(overrideStyles)(SideDrawer))
