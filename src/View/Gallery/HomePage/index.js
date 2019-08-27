import React, { Component } from 'react';
import "./index.scss"
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import _map from 'lodash/map';
import _range from 'lodash/range';
import _forEach from 'lodash/forEach';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import { Icon, Pagination, Label, Button, Select, Grid, Image, Card, Divider, Header, Dropdown, Placeholder } from 'semantic-ui-react'
import { bindActionCreators } from 'redux';
import { respCodes } from "Utils/Config/constants";
import { getImages, getTags } from 'Reducer/API/APIActions';
import { startLoading, stopLoading } from 'Reducer/UI/UIActions';
import { BASE_URL } from 'Utils/Config/constants'
import Loader from 'react-loaders'

const overrideStyles = theme => ({
  gridList: {

  },
  subheader: {
    height: 'auto'
  },
});


class HomePage extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      currPage: 1,
      imgPerPage: '12',
      selectedTags: [],
      isContentLoading: false
    }
    this.onPageChange = this.onPageChange.bind(this)
    this.onPerPageChange = this.onPerPageChange.bind(this)
    this.onDropdownChange = this.onDropdownChange.bind(this)
    this.onClickLabel = this.onClickLabel.bind(this)
    this.handleContentLoading = this.handleContentLoading.bind(this)
    this.onClickClearTags = this.onClickClearTags.bind(this)
  }

  async componentDidMount(){
    startLoading()
    const {
      userId
    } = this.props
    await this.props.getImages(-1, 1, 12, [])
    if(!this.props.tags){ await this.props.getTags()}
    stopLoading()
  }

  async onPageChange(e, props){
    console.log(">>> HomePage.onPageChange.props:", props, this.props)
    const {
      userId, lastRespMsg
    } = this.props
    const {
      imgPerPage, selectedTags
    } = this.state
    this.handleContentLoading('start')
    await this.props.getImages(-1, props.activePage, imgPerPage, selectedTags)
    this.handleContentLoading('stop')
  }

  async onDropdownChange(e, dropdownObj){
    console.log(">>> onDropdownChange.dropdownObj.value: ", dropdownObj.value)
    this.setState({
      selectedTags: dropdownObj.value
    })
    const {
      currPage
    } = this.props
    this.handleContentLoading('start')
    await this.props.getImages(-1, currPage, this.state.imgPerPage, dropdownObj.value)
    this.handleContentLoading('stop')
  }

  async onPerPageChange(e, selectTarget){
    console.log(">>> onPerPageChange:", selectTarget)
    this.setState({
      currPage: 1,
      imgPerPage: selectTarget.value
    })
    const {
      currPage
    } = this.state
    this.handleContentLoading('start')
    await this.props.getImages(-1, currPage, selectTarget.value, this.state.selectedTags)
    this.handleContentLoading('stop')
  }

  async onClickLabel(idx){
    // idx refers to the index of the elem in the selectedTags array
    var selectedTagsCpy = this.state.selectedTags
    var tmpSelectedTags = selectedTagsCpy.slice(0,idx).concat(selectedTagsCpy.slice(idx + 1, selectedTagsCpy.length))
    this.setState({
      currPage: 1,
      selectedTags: tmpSelectedTags
    })
    const {
      currPage, imgPerPage
    } = this.state

    this.handleContentLoading('start')
    await this.props.getImages(-1, 1, imgPerPage, tmpSelectedTags)
    this.handleContentLoading('stop')
  }

  async onClickClearTags(){
    const {
      imgPerPage
    } = this.state
    this.setState({
      currPage: 1,
      selectedTags: []
    })
    this.handleContentLoading('start')
    await this.props.getImages(-1, 1, imgPerPage, [])
    this.handleContentLoading('stop')
  }

  handleContentLoading(type){
    if(type === 'start'){
      this.setState({
        isContentLoading: true
      })
    }else{
      //just to make the state transition look smooth
      setTimeout(() => {
        this.setState({
          isContentLoading: false
        })
      }, 300);
    }
  }

  render(){
    const {
      classes, isLoading, userId, lastRespMsg,
      data, imgCount, numPages, tags
    } = this.props

    const {
      imgPerPage, currPage, selectedTags, isContentLoading
    } = this.state

    let cardIdxToColor = ['red','orange','yellow','olive','green','teal','blue','violet',
    'purple','pink','brown','grey','black']

    let tagsOptions = _map(tags, (tag, idx) => {
      return{
        key: tag,
        text: tag,
        value: idx + 1,
      }
    })

    return (
      <div className="div-homePage-wrapper">
        <div className="div-pageWidgets-wrapper">
          <Pagination
            defaultActivePage={1}
            ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
            firstItem={{ content: <Icon name='angle double left' />, icon: true }}
            lastItem={{ content: <Icon name='angle double right' />, icon: true }}
            prevItem={{ content: <Icon name='angle left' />, icon: true }}
            nextItem={{ content: <Icon name='angle right' />, icon: true }}
            onPageChange={this.onPageChange}
            totalPages={numPages}
          />

          <div className="div-choosePageSelect">
            <span className="span-imgPerPage" >Images per page:</span>
            <Select onChange={this.onPerPageChange} value={imgPerPage} options={[
              { key: '12', value: '12', text: '12 images per page' },
              { key: '24', value: '24', text: '24 images per page' },
            ]}/>
          </div>
        </div>

        <div className="div-tagsGrid-wrapper">
          <Card className="Card-tags" color="blue">
            <Divider horizontal>
              <Header className="Header-title" as='h4'>
                <Icon name='tags' />
                Availale Tags
              </Header>
            </Divider>
            <Dropdown
              placeholder='Tags'
              className="Dropdown-tags"
              value={selectedTags}
              multiple
              minCharacters={2}
              search
              selection
              options={tagsOptions}
              renderLabel={()=>null}
              onChange={this.onDropdownChange}
            />
            <Button className="Button-clearSelectedTags" content="Clear selected tags" onClick={this.onClickClearTags}/>

            <Divider horizontal>
              <Header className="Header-title" as='h4'>
                <Icon name='check' />
                <Icon name='tags' />
                Selected Tags
              </Header>
            </Divider>

            <div className="div-selectedTags-wrapper">
              {
                _map(selectedTags, (nonUsed ,idx) => {
                  return (
                    <Label onClick={()=>this.onClickLabel(idx)} className="Label-tags" key={"Label-" + idx}>
                      {tags[selectedTags[idx]-1]}
                    </Label>
                  )
                })
              }
              {
                selectedTags.length == 0 && <Label className="Label-tags">No tags selected</Label>
              }
            </div>
          </Card>

          <Card className="Card-imgs" color="blue">
            {
              <Grid padded columns={4}  className="Grid-img-wrapper">
                {
                  (isContentLoading) ?
                  <div className="div-contentLoader">
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      color="#000000"
                      active
                    />
                  </div>
                  : (data && data.length == 0) ? (
                    <div className="div-noImage-placeholder">
                      <span className="span-noImages"><Icon name="images"/> No Images</span>
                    </div>) : _map(data, (elem, idx) => {
                    return (
                      <Grid.Column key={"GridCol-" + idx}>
                        <Card className="Card-img" color={cardIdxToColor[idx%12]}>
                          <Image src={BASE_URL + elem.image_file}/>
                        </Card>
                      </Grid.Column>
                    )
                  })
                }
              </Grid>
            }
          </Card>
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(overrideStyles)(HomePage))
