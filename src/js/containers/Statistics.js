import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Statistics extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    const { state, props } = this
    return (
      <div className="statistics app-content">
        <div className="content">
          <div className="actions-bar">
            <input type="button" value="Periodo" />
            <input type="button" value="Buscar" />
          </div>
        </div>
      </div>
    )
  }
}

Statistics.propTypes = {

}

export default Statistics
