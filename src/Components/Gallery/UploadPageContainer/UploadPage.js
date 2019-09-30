import React, { Component } from 'react';
import "./index.scss"
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import AddPhotoAlternate from '@material-ui/icons/AddPhotoAlternate';
import Dropzone from 'react-dropzone'
import { Form, Field } from 'react-final-form'
import _forEach from 'lodash/forEach';
import _map from 'lodash/map';
import _assign from 'lodash/assign';
import { FieldArray } from 'react-final-form-arrays'
import { respCodeToMsg, respCodes } from 'Utils/Config/constants';
import { withSnackbar } from 'notistack';
import { Dropdown, Input, Button } from 'semantic-ui-react'
import { compose } from 'recompose';
import DividerTitle from 'Components/UI/DividerTitle';

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
    super(props);
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

  handleSnackBar(msg, variant){
    this.props.enqueueSnackbar(msg, {variant})
  }

  async onDrop(acceptedFiles){
    console.log(">>> onDrop.acceptedFiles:", acceptedFiles)
    var fileList = []
    var prevList = []
    _forEach(acceptedFiles, (file, i) => {
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
    console.log(">>>>>>>>>> onFormSubmit")
    e.preventDefault()
    const{
      files, imgNames, imgDescs, tags
    } = this.state
    const access = this.props.access
    var isUploadSuccess = true
    this.props.startLoading()
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
      this.setState({ imgNames })
    }else if(eNameArray[0] == "imgDesc"){
      imgDescs[parseInt(eNameArray[1])] = eVal
      this.setState({ imgDescs })
    }
  }

  render(){
    const {
      classes
    } = this.props

    const {
      files, modifiedTags
    } = this.state

    // console.log(this.state)
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
            <DividerTitle iconName='images outline' title='Upload Images'/>
            { files.length == 0 && <div className="div-placeholder"></div> }
            { files.length > 0 && _map(files, (image, idx)=>{
              return (
                <div key={image.name + idx} className="div-uploadField">
                  <div>
                    {
                      _map(['imgName','imgDesc'], (elem, innerIdx) => {
                        return (
                        <Input icon="list" iconPosition="left" key={`Input-${innerIdx}`}
                          placeholder={innerIdx == 0 ? "Image name" : "Image description"}
                          className={`Input-${elem}`}
                          name={`${elem}-${idx}`}
                          value={innerIdx == 0 ? this.state.imgNames[parseInt(idx)]:
                              this.state.imgDescs[parseInt(idx)]}
                          onChange={this.onInputChange}
                          />
                        )
                      })
                    }

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
export default compose(
  withStyles(overrideStyles),
  withSnackbar
)(UploadPage)

UploadPage.protoTypes = {
  classes: PropTypes.object,
  access: PropTypes.string.isRequired,
  isLogin: PropTypes.bool.isRequired,
  tags:PropTypes.arrayOf(PropTypes.number).isRequired,
  upsertImage: PropTypes.func.isRequired,
  verifyJWTToken: PropTypes.func.isRequired,
  startLoading: PropTypes.func.isRequired,
  stopLoading: PropTypes.func.isRequired,
  userLogout: PropTypes.func.isRequired,
}
