import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { } from '../actions'

class FacialRecognition extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    const { state, props } = this

    return (
      <div className="app-content facial-recognition small-padding">
        <div className="content">
          <h2>Reconocimiento Facial</h2>
        </div>
      </div>
    )
  }
}

FacialRecognition.propTypes = {

}

function mapStateToProps({}) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FacialRecognition)
