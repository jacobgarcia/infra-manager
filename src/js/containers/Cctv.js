import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import { } from '../actions'

class Cctv extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    const { state, props } = this

    return (
      <div className="app-content cctv small-padding">
        <Helmet>
          <title>Connus | CCTV</title>
        </Helmet>
        <div className="content">
          <h2>CCTV</h2>
        </div>
      </div>
    )
  }
}

Cctv.propTypes = {

}

function mapStateToProps({}) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cctv)
