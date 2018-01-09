import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import { } from '../actions'

class Reports extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    const { state, props } = this

    return (
      <div className="app-content reports small-padding">
        <Helmet>
          <title>Connus | Reportes</title>
        </Helmet>
        <div className="content">
          <h2>Reportes</h2>
        </div>
      </div>
    )
  }
}

Reports.propTypes = {

}

function mapStateToProps({}) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports)
