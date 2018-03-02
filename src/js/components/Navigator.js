import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

import { getAccessTitle } from '../lib/CodeExtractor'

class Navigator extends Component {
  constructor(props) {
    super(props)

    this.state = {
      time: 0,
      isHidden: true
    }

    this.onKeyDown = this.onKeyDown.bind(this)
  }

  closeNavigator() {
    this.setState({
      isHidden: true
    })
  }

  onKeyDown({ctrlKey, key}) {
    // TODO verify is not from input
    if (key === 'm' && ctrlKey) {
      this.setState(prev => ({
        isHidden: !prev.isHidden
      }))
    }
  }

  logOut() {
    localStorage.removeItem('token')
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown)
  }

  render() {
    const { state, props } = this
    return (
      <ul className={`navigator ${state.isHidden ? 'hidden' : ''}`}>
        <ul className="navigator-header">
          <li className="sandwitch-icon" onClick={() => this.setState(prev => ({isHidden: !prev.isHidden}))}/>
          <li className="username" onClick={() => this.closeNavigator()}>
            <NavLink to="/settings" className="fade"><span className="fade">{getAccessTitle(props.credentials.user && props.credentials.user.access)}</span>{props.credentials.user && props.credentials.user.name}</NavLink><img src={props.credentials.company && props.credentials.company.logo} alt="Company Icon" className="fade"/>
          </li>
        </ul>
        <ul>
          <li onClick={() => this.closeNavigator()}>
            <NavLink exact to="/" className="status">
              <span className="status fade">Estatus</span>
            </NavLink>
          </li>
          <li onClick={() => this.closeNavigator()}>
            <NavLink to="/sites" className="sites">
              <span className="status fade">Sitios</span>
            </NavLink>
          </li>
          <li className="hr" />
          <h2 className="fade">Servicios</h2>
          {
            props.services.filter(service => props.credentials.company ? props.credentials.company.services.some($0 => $0 === service._id) : false).map(({title, name}) =>
              <li key={name} onClick={() => this.closeNavigator()}>
                <NavLink to={`/${name}`} className={name}>
                  <span className="access fade">{title}</span>
                </NavLink>
              </li>
            )
          }
          <li className="hr" />
          <li className="hr" />
          <li onClick={() => this.closeNavigator()}><NavLink to="/users" className="users"><span className="fade">Usuarios</span></NavLink></li>
          <li onClick={() => this.closeNavigator()}><NavLink to="/reports" className="reports"><span className="fade">Reportes</span></NavLink></li>
          <li className="hr" />
          <li className="hr" />
          <li onClick={() => this.closeNavigator()}><NavLink to="/settings" className="settings"><span className="settings fade">Ajustes</span></NavLink></li>
        </ul>
        <li onClick={() => this.closeNavigator()} className="logout">
          <NavLink exact to="/login" className="logout" onClick={this.logOut}>
            <span className="fade">Cerrar sesión</span>
          </NavLink>
        </li>
      </ul>
    )
  }
}

Navigator.defaultProps = {
  services: [
    {
      title: 'Sensorización',
      name: 'sensors',
      _id: '00'
    }, {
      title: 'Accesos',
      name: 'accesses',
      _id: '01'
    }, {
      title: 'Flujo vehícular',
      name: 'vehicular-flow',
      _id: '02'
    }, {
      title: 'Perímetro',
      name: 'perimeter',
      _id: '03'
    }, {
      title: 'FR',
      name: 'facial-recognition',
      _id: '04'
    }, {
      title: 'Video Vigilancia',
      name: 'video-surveillance',
      _id: '05'
    },{
      title: 'Inventario',
      name: 'inventory',
      _id: '06'
    }
  ]
}

export default Navigator
