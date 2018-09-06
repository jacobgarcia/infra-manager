import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

class Reports extends Component {
  static propTypes = {}

  constructor(props) {
    super(props)

    this.state = {
      iframe: {
        __html:
          '<iframe src="https://reports.zoho.com/open-view/1775635000000138743/1ca956368facb519b8e12520160bb94a" width="540" height="450"></iframe>'
      }
    }
  }

  render() {
    const { state } = this

    return (
      <div className="app-content reports small-padding">
        <Helmet>
          <title>Connus | Reportes</title>
        </Helmet>
        <div className="content">
          <h2>Reportes</h2>
          <div dangerouslySetInnerHTML={state.iframe} />
        </div>
      </div>
    )
  }
}

export default Reports
