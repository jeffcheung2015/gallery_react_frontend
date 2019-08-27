import React, { Component } from 'react';
import "./index.scss"
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import AddPhotoAlternate from '@material-ui/icons/AddPhotoAlternate';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Dropzone from 'react-dropzone'
import { upsertImage } from "Reducer/API/APIActions";
import { Form, Field } from 'react-final-form'
import _forEach from 'lodash/forEach';
import _map from 'lodash/map';
import _assign from 'lodash/assign';
import { FieldArray } from 'react-final-form-arrays'
import { bindActionCreators } from 'redux';
import { respCodeToMsg, respCodes } from 'Utils/Config/constants';
import { startLoading, stopLoading } from "Reducer/UI/UIActions";
import { verifyJWTToken, userLogout } from "Reducer/User/UserActions";
import { withSnackbar } from 'notistack';
import { Dropdown, Input, Button, Divider, Header, Icon } from 'semantic-ui-react'
import axios from 'axios'

const overrideStyles = theme => ({
  uploadCard:{
    textAlign: "center",
    width: "40%",
    height: "100%"
  },
  pendingUpload:{
    width: "55%",
    marginLeft: "10px"
  },
  AddPhotoIcon:{
    margin: "auto",
    display: "block"
  }

});

class UploadPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      files: [],
      imgNames: null,
      imgDescs: null,
      tags: null,
      modifiedTags: []
    }
    this.onDrop = this.onDrop.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.onDropdownChange = this.onDropdownChange.bind(this)
  }

  handleSnackBar(msg, variant){
    this.props.enqueueSnackbar(msg, {variant})
  }

  onDrop(acceptedFiles){
    console.log(">>> onDrop.acceptedFiles:", acceptedFiles)
    var fileList = []
    var prevList = []
    _forEach(acceptedFiles, (file, i) => {
      var target = file.target
      const reader = new FileReader()
      var res = {}
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        fileList.push(file)
        prevList.push(reader.result)
        if (i == acceptedFiles.length - 1){
          this.setState({
            files: fileList,
            prevs: prevList,
            imgNames: new Array(acceptedFiles.length).fill(""),
            imgDescs: new Array(acceptedFiles.length).fill(""),
            tags: new Array(acceptedFiles.length).fill(new Array()),
          })
        }
      }
      reader.readAsDataURL(file)
    })
  }


  async onFormSubmit(e){
    e.preventDefault()
    const{
      files, imgNames, imgDescs, tags
    } = this.state

    this.props.startLoading()
    const access = localStorage.getItem("access")
    var isUploadSuccess = true
    for(var i = 0; i < files.length; i++) {
      var formData = new FormData()
      formData.append("image_name", imgNames[i])
      formData.append("image_desc", imgDescs[i])
      formData.append("image_file", files[i])
      formData.append("api_type", "insert")
      _forEach(tags[i], (tag, idx)=>{
        formData.append("tags", tags[i][idx])
      })
      await this.props.upsertImage(
        formData,
        access
      )

      if(this.props.lastRespMsg !== respCodes.SUCCESS_REQ){
        this.handleSnackBar(respCodeToMsg[this.props.lastRespMsg], 'error')
        isUploadSuccess = false
        break
      }
    }

    this.props.stopLoading()

    if(isUploadSuccess){
      this.handleSnackBar("Upload images successfully.", 'success')
      this.setState({
        files: [],
        imgNames: null,
        imgDescs: null
      })
    }
  }

  onDropdownChange(e, data){
    console.log(`>>> onDropdownChange, data.name: ${data.name}, data.value: ${data.value}`)
    const {
      tags
    } = this.state
    var dataNameArray = data.name.split("-")
    tags[parseInt(dataNameArray[1])] = data.value
    this.setState({
      tags: tags
    })
  }

  onInputChange(e){
    const eVal = e.target.value
    const eName = e.target.name
    console.log(">>> onInputChange.eName, eVal : ", eName, eVal)

    const {
      imgNames, imgDescs
    } = this.state

    var eNameArray = eName.split("-")
    if(eNameArray[0] == "imgName"){
      imgNames[parseInt(eNameArray[1])] = eVal
      this.setState({
        imgNames: imgNames
      })
    }else if(eNameArray[0] == "imgDesc"){
      imgDescs[parseInt(eNameArray[1])] = eVal
      this.setState({
        imgDescs: imgDescs
      })
    }
  }


  async componentDidMount(){
    //user restricted area, to avoid access without valid jwt token atm user access this page
    const access = localStorage.getItem("access")
    const refresh = localStorage.getItem("refresh")
    await this.props.verifyJWTToken(access, refresh)

    if (!this.props.isLogin){
      await this.props.userLogout();
    }

    this.state.modifiedTags = _map(this.props.tags, (tag, idx) => {
      return {
        key: tag,
        text: tag,
        value: idx + 1
      }
    })
  }

  render(){
    const {
      classes
    } = this.props

    const {
      files, modifiedTags
    } = this.state

    return(
      <div className="div-uploadPage-wrapper">
        <form className="form-upload" onSubmit={this.onFormSubmit} encType="multipart/form-data">
          <Card className={classes.uploadCard}>
            <CardActionArea className={classes.cardActionArea}>
              <Dropzone
                onDrop={this.onDrop}
                >
                {({getRootProps, getInputProps}) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <span className="span-drapdropText">
                        <AddPhotoAlternate className={classes.AddPhotoIcon}/>
                          Drag and drop some files here, or click to select files to upload.
                        </span>
                    </div>
                  </section>
                )}
              </Dropzone>
            </CardActionArea>
          </Card>
          <Card className={classes.pendingUpload}>
            <Divider horizontal>
              <Header as='h4'>
                <Icon name='images outline' />
                Upload Images
              </Header>
            </Divider>
            { files.length == 0 && <div className="div-placeholder"></div> }
            { files.length > 0 && _map(files, (image, idx)=>{
              return (
                <div key={image.name + idx} className="div-uploadField">
                  <div className="">
                    <Input icon="list" iconPosition="left"
                      placeholder="Image name"
                      className="Input-imgName"
                      name={"imgName-" + idx}
                      value={this.state.imgNames[parseInt(idx)]}
                      onChange={this.onInputChange}
                      />
                    <Input icon="newspaper outline" iconPosition="left"
                      placeholder="Image description"
                      className="Input-imgDesc"
                      name={"imgDesc-" + idx}
                      value={this.state.imgDescs[parseInt(idx)]}
                      onChange={this.onInputChange}
                      />
                      <Dropdown
                        className="Dropdown-tags"
                        placeholder='Tags'
                        name={"tags-" + idx}
                        onChange={this.onDropdownChange}

                        renderLabel={(label) => ({color:'blue', icon:"tag", content: label.text})}
                        multiple
                        search
                        selection
                        options={modifiedTags}
                      />
                  </div>
                  <div>
                    <img src={this.state.prevs[idx]} className="img-preview"/>
                  </div>
                </div>
              )
            })}
            {
              files.length > 0 && <Button type="submit" className="Button-submit"> Submit </Button>
            }
          </Card>
        </form>

      </div>
    )
  }
}
const mapStateToProps = (state) => {
    return {
      lastRespMsg: state.apiReducer.lastRespMsg,
      tags: state.apiReducer.tags,
      isLogin: state.userReducer.isLogin,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ upsertImage, verifyJWTToken,
       startLoading, stopLoading, userLogout }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(overrideStyles)(withSnackbar(UploadPage)))
