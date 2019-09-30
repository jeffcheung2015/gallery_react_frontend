import React, { Component } from 'react';
import "./index.scss"
import { pure } from 'recompose';
import AddPhotoAlternate from '@material-ui/icons/AddPhotoAlternate';
import PropTypes from 'prop-types';
import CardActionArea from '@material-ui/core/CardActionArea';
import Dropzone from 'react-dropzone';

const RippleDropzoneArea = (props) => {
  const{
    cardActionAreaClassName, onDrop, multiple,
  } = props

  return (
    <div className="div-rippleDropzoneArea-wrapper">
      <CardActionArea className={cardActionAreaClassName}>
        <Dropzone
          multiple={multiple}
          onDrop={onDrop}
          >
          {({getRootProps, getInputProps}) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <span className="span-drapdropText">
                  <AddPhotoAlternate />
                  Drag and drop image here, or click to select image to upload.
                </span>
              </div>
            </section>
          )}
        </Dropzone>
      </CardActionArea>
    </div>
  );
}
export default pure(RippleDropzoneArea);

RippleDropzoneArea.propTypes = {
  cardActionAreaClassName: PropTypes.string.isRequired,
  onDrop: PropTypes.func.isRequired,
  mutiple: PropTypes.bool.isRequired,
}
