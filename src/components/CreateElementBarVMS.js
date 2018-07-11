import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { NetworkOperation } from '../lib'

class CreateElementBarVMS extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showEntities: false,
      sites: [],
      selected: null
    }
  }

  componentDidMount() {
    NetworkOperation.getSites()
      .then(({data}) => {
        this.setState({
          sites: data.sites
        })
      })
      .catch(console.error)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.isCreating) {
      this.setState({
        showEntities: false,
        selected: null
      })
    }
  }

  onSelectEntity(entityId) {
    this.setState({
      selected: entityId
    })
    this.props.onEntitySelect(this.state.sites.find(state => state._id === entityId))
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
            onChange={props.onNameChange}
            type="text"
            placeholder="http://vmsurl..."
            value={props.url}
            name="url"
          />
        </div>
        <div className="coordinates">
          <input
            onChange={props.onNameChange}
            type="text"
            placeholder="User"
            value={props.user}
            name="user"
          />
          <input
            onChange={props.onNameChange}
            type="text"
            placeholder="Password"
            value={props.pass}
            name="pass"
          />
          <input
            onChange={props.onNameChange}
            type="text"
            placeholder="StreamID"
            value={props.streamid}
            name="streamid"
          />
        </div>
        {this.state.error && (
          <div className="error">
            <p>{this.state.error}</p>
          </div>
        )}
        <div className="add-entities">
          <p
            onClick={() =>
              this.setState(prev => ({ showEntities: !prev.showEntities }))
            }>
            Añadir a sitio
          </p>
          <ul className={state.showEntities ? '' : 'hidden'}>
            {state.sites.map(({ _id, name }) => (
                  <li key={_id}>
                    <input
                      type="checkbox"
                      id={_id}
                      onChange={() => this.onSelectEntity(_id)}
                      checked={_id === state.selected}
                    />
                    <label htmlFor={_id}>{name}</label>
                  </li>
                ))}
          </ul>
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
