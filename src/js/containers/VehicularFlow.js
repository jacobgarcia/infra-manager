import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { } from '../actions'

class VehicularFlow extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    const { state, props } = this

    return (
      <div className="app-content vehicular-flow">
        <div className="content">
          <h1>Flujo Vehicular</h1>
        </div>
      </div>
    )
  }
}

VehicularFlow.propTypes = {

}

function mapStateToProps({}) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VehicularFlow)
