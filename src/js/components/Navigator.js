import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

class Navigator extends Component {
  constructor(props) {
    super(props)

    this.state = {
      time: 0
    }

    // this.tick = this.tick.bind(this)
  }

  tick() {
    this.setState(prev => ({
      time: prev.time + 1000
    }))
  }

  componentDidMount() {
    this.setState({
      time: new Date().getTime()
    }, () => {
      this.interval = setInterval(() => this.tick(), 1000)
    })
  }

  render() {
    const { state, props } = this

    const date = new Date(state.time)
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
          <li className="date"><span>{date.toLocaleDateString('es-MX')}</span><span>{date.toLocaleTimeString('es-MX')}</span></li>
          <img src="" alt=""/>
          <li>John Appleseed</li>
        </ul>
      </ul>
    )
  }
}

export default Navigator
