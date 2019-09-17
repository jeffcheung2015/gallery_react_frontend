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
import { Icon, Pagination, Label, Button, Select,
   Grid, Image, Modal, Card, Divider, Header, Table,
    Dropdown, Placeholder, Search, Segment } from 'semantic-ui-react'
import { bindActionCreators } from 'redux';
import { respCodes } from "Utils/Config/constants";
import { getImages, getTags } from 'Reducer/API/APIActions';
import { startLoading, stopLoading } from 'Reducer/UI/UIActions';
// import { BASE_URL } from 'Utils/Config/constants'
import Loader from 'react-loaders'
import moment from 'moment';
import _debounce from 'lodash/debounce';

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
    this.handleContentLoading = this.handleContentLoading.bind(this)
    this.onClickClearTags = this.onClickClearTags.bind(this)
    this.handleModalClose = this.handleModalClose.bind(this)
    this.handleModalOpen = this.handleModalOpen.bind(this)
    this.onImageClick = this.onImageClick.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
  }
  handleModalClose(){
    console.log(">>> handleModalClose")
    this.setState({
      currImgName: "",
      currImgName: "",
      currImgSrc: "",
      currTags: [],
      currImgCreatedAt: "",
      imgPreviewOpen: false,
    })
  }
  handleModalOpen(){
    console.log(">>> handleModalOpen")

  }
  onImageClick(currImgName, currImgDesc, currImgSrc, currTags, currImgCreatedAt){
    console.log(">>> onImageClick")
    this.setState({
      currImgName,
      currImgDesc,
      currImgSrc,
      currTags,
      currImgCreatedAt,
      imgPreviewOpen: true
    })
  }

  async componentDidMount(){
    startLoading()
    const {
      userId
    } = this.props
    await this.props.getImages(-1, 1, 12, [], '')
    if(!this.props.tags){ await this.props.getTags()}
    stopLoading()
  }

  async onPageChange(e, props){
    console.log(">>> HomePage.onPageChange.props:", props, this.props)
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
    console.log(">>> onDropdownChange.dropdownObj.value: ", dropdownObj.value)
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
    const {
      imgPerPage, searchVal
    } = this.state
    this.setState({
      currPage: 1,
      selectedTags: []
    })
    this.handleContentLoading('start')
    await this.props.getImages(-1, 1, imgPerPage, [], searchVal)
    this.handleContentLoading('stop')
  }

  async handleSearchChange(e, searchObj){
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

    return (
      <div className="div-homePage-wrapper">
        <div className="div-pageWidgets-wrapper">
          <Modal
            className="Modal-imageViewer"
            open={imgPreviewOpen}
            dimmer="blurring"
            onClose={() => this.handleModalClose()}
            >
            <Table basic='very' celled collapsing className="Table-imgDescContent">
            <Table.Body>
              <Table.Row>
                <Table.Cell className="TableCell-imgDescContent-key"><Icon name="list"/>Name:</Table.Cell>
                <Table.Cell className="TableCell-imgDescContent-val">{currImgName}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="TableCell-imgDescContent-key"><Icon name="newspaper outline"/>Description:</Table.Cell>
                <Table.Cell className="TableCell-imgDescContent-val">{currImgDesc}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="TableCell-imgDescContent-key"><Icon name="calendar alternate outline"/>Uploaded Date:</Table.Cell>
                <Table.Cell className="TableCell-imgDescContent-val">{currImgCreatedAt}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="TableCell-imgDescContent-key"><Icon name="tags"/>Tags:</Table.Cell>
                <Table.Cell className="TableCell-imgDescContent-val">
                {
                  _map(currTags, (elem, idx) => {
                    return (
                      <Label className="Label-tags" key={"currLabel-" + idx}>
                      {tags[currTags[idx]-1]}
                      </Label>
                    )
                  })
                }
                </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <Image src={currImgSrc} wrapped />
          </Modal>

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
            input={{ icon: 'search', iconPosition: 'right' }}
            onSearchChange={_debounce(this.handleSearchChange, 500, {
              leading: true,
            })}
            showNoResults={false}
            loading={isContentLoading}
            value={searchVal}
          />
          {
            /*
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {
              leading: true,
            })}
            */
          }

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
              <Grid padded columns={4} className="Grid-img-wrapper">
                {
                  (isContentLoading) ?
                  <div className="div-contentLoader">
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      color="#000000"
                      active
                    />
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
                            <Image src={currImgSrc}/>
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
