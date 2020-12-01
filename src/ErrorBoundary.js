import React, { Component } from 'react';
import PropTypes from 'prop-types'

export default class NotefulErrors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(error) {
    return {hasError:true};

  }
  render() {
    if (this.state.hasError){
      return(
        <div>
          <h2>Could not display the correct content</h2>
        </div>
      )
    }
    return this.props.children;
  }
}

NotefulErrors.propTypes = {
  children: PropTypes.array
}