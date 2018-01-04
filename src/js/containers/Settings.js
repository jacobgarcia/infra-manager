import React, { Component } from 'react'
import PropTypes from 'prop-types'

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
        <div className="content vertical">
          <ul className="mini-nav vertical">
            <li className="active">Perfil</li>
            <li>Personalizar</li>
            <li>Lista negra</li>
          </ul>
          <form action="">
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
              <label htmlFor="name">Repetir contraseña</label>
              <input type="text" placeholder=""/>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

Settings.propTypes = {

}

export default Settings
