import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

class Reports extends Component {
  static propTypes = {}

  state = {}

  render() {
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

export default Reports
