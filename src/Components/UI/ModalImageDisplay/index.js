import React, { Component } from 'react';
import "./index.scss"
import { pure } from 'recompose';
import Loader from 'react-loaders'
import { Modal, Table, Image, Icon, Label } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import _map from 'lodash/map'

const ModalImageDisplay = (props) => {
  const{
    handleModalClose,
    imgPreviewOpen, currImgName, currImgDesc, currImgCreatedAt, currTags, tags, currImgSrc
  } = props
  return (
    <Modal
      className="Modal-imageViewer"
      open={imgPreviewOpen}
      onClose={handleModalClose}
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
      <Image alt='imageViewer-img' src={process.env.REACT_APP_SERVER_HOST_URL + currImgSrc} wrapped />
    </Modal>
  );
}
export default pure(ModalImageDisplay);

ModalImageDisplay.propTypes = {
  currImgName:PropTypes.string.isRequired,
  currImgSrc:PropTypes.string.isRequired,
  currImgDesc:PropTypes.string.isRequired,
  currImgCreatedAt:PropTypes.string.isRequired,
  currTags:PropTypes.arrayOf(PropTypes.number).isRequired,
  handleModalClose:PropTypes.func.isRequired,
  imgPreviewOpen:PropTypes.bool.isRequired,
}
