import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { NetworkOperation } from '../lib'

class CreateElementBarVMS extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showEntities: false,
      states: [],
      selected: null,
    }
  }

  componentDidMount() {
    NetworkOperation.getSites()
      .then(({data}) => {
        console.log(data)
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
            value={props.clean ? props.value : ''}
            onChange={props.onNameChange}
            name="url"
          />
        </div>
        <div className="coordinates">
          <input
            type="text"
            placeholder="User"
            value={props.clean ? props.value : ''}
            onChange={props.onNameChange}
            name="user"
          />
          <input
            type="text"
            placeholder="Password"
            value={props.clean ? props.value : ''}
            onChange={props.onNameChange}
            name="pass"
          />
          <input
            type="text"
            placeholder="StreamID"
            value={props.clean ? props.value : ''}
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
  onEntitySelect: PropTypes.func
}

export default CreateElementBarVMS
