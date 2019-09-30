import React, { Component } from 'react';
import "./index.scss"
import { Divider, Header, Icon } from 'semantic-ui-react'
import { pure } from 'recompose';
import PropTypes from 'prop-types';

const DividerTitle = (props) => {
  const {
    headerClassName, title, iconName
  } = props
  return (
    <Divider horizontal>
      <Header as='h4' className={headerClassName}>
        <Icon name={iconName} />
        {title}
      </Header>
    </Divider>
  )
}

export default pure(DividerTitle)
DividerTitle.propTypes = {
  title: PropTypes.string.isRequired,
  headerClassName: PropTypes.string,
  iconName: PropTypes.string.isRequired
}
