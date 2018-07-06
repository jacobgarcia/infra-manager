import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { NetworkOperation } from '../lib'

class CreateElementBarVMS extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showEntities: false,
      states: [],
      selected: null
    }
  }

  componentDidMount() {
    NetworkOperation.getSites()
      .then(({data}) => {
      })
  }

  render() {
    const { props, state } = this
    return (
      <div
        className={`create-bar ${props.className}`}
        onMouseOver={props.onMouseOver}>
        <div className="description">
          <p>VMS</p>
        </div>
        <div>
          <input
            type="text"
            placeholder="http://vmsurl..."
            value={props.url}
            onChange={props.onNameChange}
            name="url"
          />
        </div>
        <div className="coordinates">
          <input
            type="text"
            placeholder="User"
            value={this.state.user}
            onChange={props.onNameChange}
            name="user"
          />
          <input
            type="text"
            placeholder="Password"
            value={this.state.pass }
            onChange={props.onNameChange}
            name="pass"
          />
          <input
            type="text"
            placeholder="StreamID"
            value={this.state.streamid}
            onChange={props.onNameChange}
            name="streamid"
          />
        </div>
        <input
          type="button"
          className={`${props.isNewElementValid ? '' : 'disabled'} destructive`}
          value="Añadir"
          onClick={() => {
            (props.isNewElementValid ? props.onCreate() : null)
            }
          }
        />
        {
          props.error && (
          <div className="error">
            <p>{props.error}</p>
          </div>
        )}
      </div>
    )
  }
}


CreateElementBarVMS.propTypes = {
  onEntitySelect: PropTypes.func,
  clean: PropTypes.bool
}

CreateElementBarVMS.defaultProps = {
  clean: false
}

export default (CreateElementBarVMS)
