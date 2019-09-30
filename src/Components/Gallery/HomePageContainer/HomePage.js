import React, { Component } from 'react';
import "./index.scss"
import PropTypes from 'prop-types';
import { Icon, Pagination, Label, Button, Select, Image,
   Grid, Card, Dropdown, Placeholder, Search, Segment } from 'semantic-ui-react'
import _map from 'lodash/map';
import _range from 'lodash/range';
import _forEach from 'lodash/forEach';
import { respCodes } from "Utils/Config/constants";
import Loader from 'react-loaders'
import moment from 'moment';
import _debounce from 'lodash/debounce';
import DividerTitle from 'Components/UI/DividerTitle'
import ModalImageDisplay from 'Components/UI/ModalImageDisplay'

class HomePage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      currPage: 1,
      imgPerPage: '12',
      selectedTags: [],
      isContentLoading: false,
      imgPreviewOpen: false,
      currImgDesc: "",
      currImgName: "",
      currImgSrc: "",
      currImgCreatedAt: "",
      currTags: [],
      searchVal: ""
    }
    this.onPageChange = this.onPageChange.bind(this)
    this.onPerPageChange = this.onPerPageChange.bind(this)
    this.onDropdownChange = this.onDropdownChange.bind(this)

    this.onClickLabel = this.onClickLabel.bind(this)
    this.onClickClearTags = this.onClickClearTags.bind(this)
    this.handleContentLoading = this.handleContentLoading.bind(this)
    this.handleModalClose = this.handleModalClose.bind(this)
    this.onImageClick = this.onImageClick.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
  }

  handleModalClose(){
    this.setState({
      currImgName: "",
      currImgName: "",
      currImgSrc: "",
      currTags: [],
      currImgCreatedAt: "",
      imgPreviewOpen: false,
    })
  }

  onImageClick(currImgName, currImgDesc, currImgSrc, currTags, currImgCreatedAt){
    this.setState({
      currImgName, currImgDesc, currImgSrc, currTags, currImgCreatedAt, imgPreviewOpen: true
    })
  }

  async componentDidMount(){
    this.props.startLoading()
    const {
      userId
    } = this.props
    await this.props.getImages(-1, 1, 12, [], '')
    if(!this.props.tags){ await this.props.getTags()}
    this.props.stopLoading()
  }

  async onPageChange(e, props){
    console.log(">>> HomePageContainer.onPageChange.props:", props)
    const {
      userId, lastRespMsg
    } = this.props
    const {
      imgPerPage, selectedTags, searchVal
    } = this.state
    this.handleContentLoading('start')
    await this.props.getImages(-1, props.activePage, imgPerPage, selectedTags, searchVal)
    this.handleContentLoading('stop')
  }

  async onDropdownChange(e, dropdownObj){
    console.log(">>> onDropdownChange.dropdownObj.value: ", dropdownObj)
    this.setState({
      selectedTags: dropdownObj.value
    })
    const {
      imgPerPage, searchVal
    } = this.state
    const {
      currPage
    } = this.props
    this.handleContentLoading('start')
    await this.props.getImages(-1, currPage, imgPerPage, dropdownObj.value, searchVal)
    this.handleContentLoading('stop')
  }

  async onPerPageChange(e, selectTarget){
    console.log(">>> onPerPageChange:", selectTarget)
    this.setState({
      currPage: 1,
      imgPerPage: selectTarget.value
    })
    const {
      currPage, searchVal, selectedTags
    } = this.state
    this.handleContentLoading('start')
    await this.props.getImages(-1, currPage, selectTarget.value, selectedTags, searchVal)
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
      currPage, imgPerPage, searchVal
    } = this.state

    this.handleContentLoading('start')
    await this.props.getImages(-1, 1, imgPerPage, tmpSelectedTags, searchVal)
    this.handleContentLoading('stop')
  }

  async onClickClearTags(){
    this.setState({
      currPage: 1,
      selectedTags: []
    })
    const {
      imgPerPage, searchVal
    } = this.state

    this.handleContentLoading('start')
    await this.props.getImages(-1, 1, imgPerPage, [], searchVal)
    this.handleContentLoading('stop')
  }

  async handleSearchChange(e, searchObj){
    console.log('handleSearchChange', e, searchObj)
    const {
      imgPerPage, selectedTags
    } = this.state
    this.setState({
      currPage: 1,
      selectedTags: [],
      searchVal: searchObj.value
    })
    this.handleContentLoading('start')
    await this.props.getImages(-1, 1, imgPerPage, [], searchObj.value)
    this.handleContentLoading('stop')
  }

  handleContentLoading(type){
    if(type === 'start'){
      this.setState({ isContentLoading: true })
    }else{
      setTimeout(() => { //just to make the state transition look smooth
        this.setState({ isContentLoading: false })
      }, 300);
    }
  }

  render(){
    const {
      isLoading, userId, lastRespMsg,
      data, imgCount, numPages, tags,
    } = this.props

    const {
      imgPerPage, currPage, selectedTags, isContentLoading,
      imgPreviewOpen, currImgSrc, currImgName, currImgDesc, currTags,
      currImgCreatedAt, searchVal
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

    let imgInfo = {
      currImgName, currImgDesc, currImgSrc, currTags, currImgCreatedAt
    }

    return(
      <div className="div-homePage-wrapper">
        <div className="div-pageWidgets-wrapper">
          <ModalImageDisplay
            handleModalClose={this.handleModalClose}
            imgPreviewOpen={imgPreviewOpen}
            tags={tags}
            {...imgInfo}
          />
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

          <Search
            className="Search-image"
            input={{ icon: 'search' }}
            onSearchChange={_debounce(this.handleSearchChange, 500, { leading: true })}
            showNoResults={false}
            loading={isContentLoading}
            value={searchVal}
          />

          <div className="div-choosePageSelect">
            <span className="span-imgPerPage" >Images per page:</span>
            <Select className="Select-imgPerPage" onChange={this.onPerPageChange} value={imgPerPage} options={[
              { key: '12', value: '12', text: '12 images per page' },
              { key: '24', value: '24', text: '24 images per page' },
            ]}/>
          </div>
        </div>

        <div className="div-tagsGrid-wrapper">
          <Card className="Card-tags" color="blue">
            <DividerTitle headerClassName="Header-title" iconName="tags" title="Available Tags" />
            <Dropdown
              placeholder='Tags' className="Dropdown-tags"
              value={selectedTags} minCharacters={2}
              multiple search selection
              options={tagsOptions}
              renderLabel={()=>null}
              onChange={this.onDropdownChange}
            />
            <Button className="Button-clearSelectedTags" content="Clear selected tags" onClick={this.onClickClearTags}/>
            <DividerTitle headerClassName="Header-title" iconName="check" title="Selected Tags" />
            <div className="div-selectedTags-wrapper">
              {
                selectedTags && selectedTags.length == 0 ? <Label>No tags selected</Label> :
                _map(selectedTags, (nonUsed ,idx) => {
                  return (
                    <Label onClick={()=>this.onClickLabel(idx)} className="Label-tags" key={"Label-" + idx}>
                      {tags[selectedTags[idx]-1]}
                    </Label>
                  )
                })
              }
            </div>
          </Card>

          <Card className="Card-imgs" color="blue">
            {
              <Grid padded columns={4} className="Grid-img-wrapper">
                {
                  (isContentLoading) ?
                  <div className="div-contentLoader">
                    <Loader type="line-scale-pulse-out-rapid" color="#000000" active />
                  </div>
                  : ((data && data.length == 0) || !data) ? (
                    <div className="div-noImage-placeholder">
                      <span className="span-noImages"><Icon name="images"/> No Images</span>
                    </div>) : _map(data, (elem, idx) => {
                      let currImgSrc = elem.image_file
                      let currImgName = elem.image_name
                      let currImgDesc = elem.image_desc
                      let currTags = elem.tags
                      let currImgCreatedAt = moment(new Date(elem.created_at)).format("MM-DD-YYYY")
                      return (
                        <Grid.Column key={"GridCol-" + idx}>
                          <Card onClick={() => this.onImageClick(currImgName, currImgDesc, currImgSrc, currTags, currImgCreatedAt)} className="Card-img" color={cardIdxToColor[idx%12]}>
                            <Image src={(process.env.NODE_ENV == 'development' ? process.env.REACT_APP_SERVER_HOST_URL : "") + currImgSrc}/>
                          </Card>
                        </Grid.Column>
                      )
                    }
                  )
                }
              </Grid>
            }
          </Card>
        </div>
      </div>
    )
  }
}
export default HomePage;

HomePage.protoTypes = {
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

  startLoading: PropTypes.func.isRequired,
  stopLoading: PropTypes.func.isRequired,
  getImages: PropTypes.func.isRequired,
  getTags: PropTypes.func.isRequired,
}
