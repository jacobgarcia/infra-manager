import React, { Component } from 'react'
// import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

// import { } from '../actions'

class Services extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    const { state, props } = this

    return (
      <div className="services app-content">
        <Helmet>
          <title>Connus | Servicios</title>
        </Helmet>
        <div className="overall-container">
        </div>
        <div className="content">
          <ul className="inline-nav">
            <li className="active">Registros</li>
            <li>Sucesos</li>
          </ul>
        </div>
      </div>
    )
  }
}

Services.propTypes = {

}

export default Services
