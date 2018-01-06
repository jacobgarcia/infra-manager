import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { } from '../actions'

class Perimeter extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    const { state, props } = this

    return (
      <div className="app-content perimeter">
        <div className="content">
          <h1>Perímetro</h1>
        </div>
      </div>
    )
  }
}

Perimeter.propTypes = {

}

function mapStateToProps({}) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Perimeter)
