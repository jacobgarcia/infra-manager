import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

class Navigator extends Component {
  constructor(props) {
    super(props)

    this.state = {
      time: 0,
      isHidden: true
    }

    this.onKeyDown = this.onKeyDown.bind(this)
  }

  tick() {
    this.setState(prev => ({
      time: prev.time + 1000
    }))
  }

  closeNavigator() {
    this.setState({
      isHidden: true
    })
  }

  onKeyDown({ctrlKey, key}) {
    // TODO verify is not from input
    if (key === 'm') {
      this.setState(prev => ({
        isHidden: !prev.isHidden
      }))
    }
  }

  componentWillUnmount() {
    document.addEventListener('keydown', this.onKeyDown)
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown)

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
      <ul className={`navigator ${state.isHidden ? 'hidden' : ''}`}>
        <li className="sandwitch-icon" onClick={() => this.setState(prev => ({isHidden: !prev.isHidden}))}/>
        <ul>
          <li className="username" onClick={() => this.closeNavigator()}>
            <NavLink to="/settings" className="fade"><span>Administrador</span>John Appleseed</NavLink><img src="" alt="" className="fade"/>
          </li>
          <li onClick={() => this.closeNavigator()}>
            <NavLink exact to="/">
              <span className="status fade">Estatus</span>
            </NavLink>
          </li>
          <li onClick={() => this.closeNavigator()}>
            <NavLink exact to="/sites">
              <span className="status fade">Sitios</span>
            </NavLink>
          </li>
          <li className="hr" />
          <h2 className="fade">Servicios</h2>
          {
            props.services.map(({title, name}) =>
              <li key={name} onClick={() => this.closeNavigator()}>
                <NavLink to={`/${name}`}>
                  <span className="access fade">{title}</span>
                </NavLink>
              </li>
            )
          }
          <li className="hr" />
          <li className="hr" />
          <li className="fade" onClick={() => this.closeNavigator()}><NavLink to="/users"><span className="users">Usuarios</span></NavLink></li>
          <li className="fade" onClick={() => this.closeNavigator()}><NavLink to="/reports"><span className="reports">Reportes</span></NavLink></li>
          <li className="hr" />
          <li className="hr" />
          <li className="fade" onClick={() => this.closeNavigator()}><NavLink to="/settings"><span className="settings">Ajustes</span></NavLink></li>
        </ul>
        <li className="fade"><span className="settings">Cerrar sesión</span></li>
      </ul>
    )
  }
}

Navigator.defaultProps = {
  services: [
    {
      title: 'Accesos',
      name: 'accesses'
    }, {
      title: 'Flujo vehícular',
      name: 'vehicular-flow'
    }, {
      title: 'Perímetro',
      name: 'perimeter'
    }, {
      title: 'FR',
      name: 'facial-recognition'
    }, {
      title: 'CCTV',
      name: 'cctv'
    }
  ]
}

export default Navigator
