import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { } from '../actions'

class Accesses extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    const { state, props } = this

    return (
      <div className="app-content accesses">
        <div className="content">
          <h1>Accesos</h1>
        </div>
      </div>
    )
  }
}

Accesses.propTypes = {

}

function mapStateToProps({}) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Accesses)
