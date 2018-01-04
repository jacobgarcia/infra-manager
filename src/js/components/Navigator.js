import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

class Navigator extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    return (
      <ul className="navigator">
        <ul>
          <li><NavLink exact to="/">Estatus</NavLink></li>
          <li><NavLink to="/services">Servicios</NavLink></li>
          <li><NavLink to="/sites">Sitios</NavLink></li>
          <li><NavLink to="/users">Usuarios</NavLink></li>
          <li><NavLink to="/statistics">Estadísticas</NavLink></li>
        </ul>
        <ul className="user-container">
          <li>3 enero 2017 09:23 PM</li>
          <li>John Appleseed</li>
        </ul>
      </ul>
    )
  }
}

export default Navigator
