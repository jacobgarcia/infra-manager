import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

class Settings extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    const { state, props } = this
    return (
      <div className="settings app-content">
        <Helmet>
          <title>Connus | Ajustes</title>
        </Helmet>
        <div className="content vertical">
          <ul className="mini-nav vertical">
            <li className="active">Perfil</li>
            <li>Personalizar</li>
            <li>Lista negra</li>
          </ul>
          <form action="">
            <div className="field">
              <label htmlFor="name">Foto</label>
              <input type="file" />
            </div>
            <div className="field">
              <label htmlFor="name">Nombre</label>
              <input type="text" placeholder="Nombre"/>
            </div>
            <div className="field">
              <label htmlFor="name">Apellido</label>
              <input type="text" placeholder="Apellido"/>
            </div>
            <div className="field">
              <label htmlFor="name">Correo</label>
              <input type="text" placeholder="Correo"/>
            </div>
            <span className="rule">Cambiar contraseña</span>
            <div className="field">
              <label htmlFor="name">Contraseña actual</label>
              <input type="text" placeholder=""/>
            </div>
            <div className="field">
              <label htmlFor="name">Nueva contraseña</label>
              <input type="text" placeholder=""/>
            </div>
            <input type="submit" value="Guardar" className="action"/>
          </form>
        </div>
      </div>
    )
  }
}

Settings.propTypes = {

}

export default Settings
