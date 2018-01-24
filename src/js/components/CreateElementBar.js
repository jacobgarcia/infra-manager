import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { NetworkOperation } from '../lib'

class CreateElementBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showEntities: false,
      states: [],
      selected: null
    }
  }

  componentDidMount() {
    NetworkOperation.getAvailableStates()
    .then(({data}) => {
      this.setState({
        states: data.states
      })
    })
    .catch(console.error)
  }

  onSelectEntity(entityId) {
    this.setState({
      selected: entityId
    })
    NetworkOperation.getEntityPolygon(entityId)
    .then(({data}) => {
      this.props.onEntitySelect(data.state)
    })
    .catch(console.error)
  }

  getContryName(code) {
    switch (code) {
      case 'MX': return 'México'
      case 'AR': return 'Argentina'
      default: return 'Otro'
    }
  }

  render() {
    const { props, state } = this
    return (
      <div className={`create-bar ${props.className}`} onMouseOver={props.onMouseOver}>
          <div className="description">
            <p>{props.isCreatingSite ? 'Sitio' : 'Zona'}</p>
          </div>
          <div>
            <input type="text" placeholder="Nombre..." onChange={props.onNameChange}/>
          </div>
          {
            props.isCreatingSite
            ?
            <div className="coordinates">
              <input
                type="text"
                placeholder="Latitud"
                value={(props.positions && props.positions.length > 0) ? props.positions[props.positions.length - 1][0] : ''}
                name="lat"
                onChange={props.onPositionsChange}
              />
              <input
                type="text"
                placeholder="Longitud"
                value={(props.positions && props.positions.length > 0) ? props.positions[props.positions.length - 1][1] : ''}
                name="lng"
                onChange={props.onPositionsChange}
              />
            </div>
            : !props.isCreatingSubzone
            &&
            <div className="add-entities">
              <p onClick={() => this.setState(prev => ({ showEntities: !prev.showEntities }))}>Añadir estados</p>
              <ul className={state.showEntities ? '' : 'hidden'}>
                {
                  state.states.map(({_id, states}) =>
                  <ul key={_id}>
                    <span>{this.getContryName(_id)}</span>
                    {
                      states.map(({name, _id}) =>
                      <li key={_id}>
                        <input type="checkbox" id={_id} onChange={() => this.onSelectEntity(_id)} checked={_id === state.selected} />
                        <label htmlFor={_id}>{name}</label>
                      </li>
                      )
                    }
                  </ul>
                  )
                }
              </ul>
            </div>
          }
          <input
            type="button"
            className={`${props.isNewElementValid ? '' : 'disabled'} destructive`}
            value="Crear"
            onClick={() => props.isNewElementValid ? props.onCreate() : null}
          />
      </div>
    )
  }
}

export default CreateElementBar
