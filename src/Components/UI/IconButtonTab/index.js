import React, { Component } from 'react';
import "./index.scss"
import { pure } from 'recompose';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import _map from 'lodash/map';

class IconButtonTab extends React.Component{
  state = {
    activeTab: 0
  }

  handleTabClick = (idx) => {
    this.setState({
      activeTab: idx
    })
    this.props.updateTabIdx(idx)
  }

  render(){
    const {
      onClickList,
    } = this.props
    const {
      activeTab
    } = this.state

    return (
      <Button.Group labeled icon className="ButtonGroup">
        {
          _map(onClickList, (elem, idx) => (
            <Button
              key={`IconButtonTab-${idx}`}
              onClick={() => this.handleTabClick(idx)}
              icon={elem.icon}
              active={activeTab === idx}
              content={elem.content}
            />)
          )
        }
      </Button.Group>
    );
  }
}

export default (IconButtonTab);

IconButtonTab.propTypes = {
  updateTabIdx: PropTypes.func.isRequired,
  onClickList: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.string,
    content: PropTypes.string.isRequired
  })).isRequired
}
