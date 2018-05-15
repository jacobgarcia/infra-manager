import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { NavLink } from 'react-router-dom'

class Services extends Component {
  static propTypes = {}

  state = {}

  render() {
    return (
      <div className="services app-content">
        <Helmet>
          <title>Connus | Servicios</title>
        </Helmet>
        <div className="overall-container">
          <ul className="mini-nav">
            <li>
              <NavLink to="/services/access">Accesos</NavLink>
            </li>
            <li>
              <NavLink to="/services/perimeter">Perímetro</NavLink>
            </li>
            <li>
              <NavLink to="/services/fr">Reconocimiento facial</NavLink>
            </li>
            <li>
              <NavLink to="/services/fv">Flujo vehicular</NavLink>
            </li>
            <li>
              <NavLink to="/services/cctv">CCTV</NavLink>
            </li>
          </ul>
        </div>
        <div className="content">
          <ul className="inline-nav">
            <li className="active">Registros</li>
            <li>Sucesos</li>
          </ul>
        </div>
      </div>
    )
  }
}

export default Services
