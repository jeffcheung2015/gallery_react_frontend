import React, { Component } from 'react';
import "./index.scss"
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Person from '@material-ui/icons/Person';
import PersonAdd from '@material-ui/icons/PersonAdd';
import AddPhotoAlternate from '@material-ui/icons/AddPhotoAlternate';
import Home from '@material-ui/icons/Home';
import ExitToApp from '@material-ui/icons/ExitToApp';
import { userLogout } from "Reducer/User/UserActions";
import { bindActionCreators } from 'redux';

import { fade, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/styles';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import SideDrawer from 'Components/Layout/SideDrawer';
import PropTypes from 'prop-types';
import { routeName, urlPathToTitle } from 'Utils/Config/constants';

import { compose } from 'recompose';

const drawerWidth = 240

const overrideStyles = (theme) => ({
  appBar: {
    zIndex: "9999",
    transition: "margin 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms,width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
  },
  appBarShift: {
    zIndex: "9999",
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: "margin 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms,width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
  },
  toolbar:{
    minHeight: "40px !important",
    background: 'linear-gradient(to right, #DFDFDF, #EFEFEF)'
  },
  iconButtonMenu:{
    color: '#000000',
    marginRight: "20px",
  },
  globalHeaderTitle:{
    color: '#000000',
    marginRight: '20px'
  },
  inputInput: {
    width: '100%',
    margin: '1px 1px 1px 40px',
    color:'#000000'
  },
  grow: {
    flexGrow: 1,
  },
  iconButton:{
    color: "#000000"
  },
});


class GlobalHeader extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      isMenuOpen: false,
    }
    this.handleMenuClose = this.handleMenuClose.bind(this)
    this.redirect = this.redirect.bind(this)
    this.logout = this.logout.bind(this)
  }
  handleMenuClose(){
    this.setState({
      isMenuOpen: !this.state.isMenuOpen
    })
  }

  redirect(path){
    this.props.history.push(path);
  }

  async logout(){
    await this.props.userLogout();
    this.redirect("")
  }

  render(){
    const {
      classes, isDrawerOpen, handleDrawerAction, isLogin
    } = this.props

    const {
      isMenuOpen
    } = this.state
    const pathRoute = urlPathToTitle[this.props.history.location.pathname]
    // const headerTitle = (pathRoute) ? pathRoute : 'Gallery'
    const headerTitle = ''
    //for some reason material ui's tooltip doesnt allow manual update of the classes
    const theme = createMuiTheme({
      overrides: {
        MuiTooltip: {
          popper:{
            zIndex: "10002",
          },
          tooltip: {
            color: "#FFFFFF",
            background: "#0A0A0A",
          }
        }
      }
    });
    return(
      <div className="div-globalHeader-wrapper">
        { isLogin && <SideDrawer
          isDrawerOpen={isDrawerOpen}
          handleDrawerAction={handleDrawerAction}
        />}
        <MuiThemeProvider theme={theme}>
          <AppBar className={isDrawerOpen ? classes.appBarShift : classes.appBar}>
            <Toolbar className={classes.toolbar}>
              {isLogin && !isDrawerOpen &&
                (<IconButton
                  onClick={handleDrawerAction}
                  edge="start"
                  className={classes.iconButtonMenu}>
                  <MenuIcon />
                </IconButton>)
              }

              <div className="div-leftPartIcons">
                <IconButton
                  className={classes.iconButton}
                  onClick={() => this.redirect('')}>
                  <Tooltip title="Home" classes={classes.tooltip}>
                    <Home />
                  </Tooltip>
                </IconButton>
              </div>

              <Typography className={'Typography-gallery ' + classes.globalHeaderTitle} variant="h6" noWrap>
                Gallery
              </Typography>

              <div className={classes.grow} />


              <div className="div-headerIcons">
                <div className={(!isLogin ? 'div-visitor ' : 'div-hidden ') + classes.headerIcons}>
                    <IconButton
                      className={classes.iconButton}
                      onClick={() => this.redirect('login')}>
                      <Tooltip title="Login" classes={classes.tooltip}>
                        <Person />
                      </Tooltip>
                    </IconButton>

                    <IconButton
                      className={classes.iconButton}
                      onClick={() => this.redirect('signup')}>
                      <Tooltip title="Sign up" classes={classes.tooltip}>
                        <PersonAdd />
                      </Tooltip>
                    </IconButton>
                </div>
                <div className={(isLogin ? 'div-member ' : 'div-hidden ') + classes.headerIcons}>
                  <IconButton
                    className={classes.iconButton}
                    onClick={() => this.redirect("upload")}>
                    <Tooltip title="Upload" classes={classes.tooltip}>
                      <AddPhotoAlternate />
                    </Tooltip>
                  </IconButton>
                  <IconButton
                    className={classes.iconButton}
                    onClick={() => this.redirect('profile')}>
                    <Tooltip title="Profile" classes={classes.tooltip}>
                      <AccountCircle />
                    </Tooltip>
                  </IconButton>
                  <IconButton
                    edge="end"
                    className={classes.iconButton}
                    onClick={this.logout}>
                    <Tooltip title="Logout" classes={classes.tooltip}>
                      <ExitToApp />
                    </Tooltip>
                  </IconButton>
                </div>
              </div>
            </Toolbar>
          </AppBar>
        </MuiThemeProvider>

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
  return bindActionCreators({userLogout}, dispatch)

};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(overrideStyles),
)(GlobalHeader);

GlobalHeader.protoTypes = {
  classes: PropTypes.object,
  isDrawerOpen: PropTypes.bool.isRequired,
  handleDrawerAction: PropTypes.func.isRequired,
  isLogin: PropTypes.bool.isRequired,
  tags:PropTypes.arrayOf(PropTypes.number)
}
