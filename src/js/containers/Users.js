import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Users extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    const { state, props } = this
    return (
      <div className="users app-content">
        <div className="content">
          <div className="table">
            <div className="table-header">
              <div className="table-item">
                <div>Nombre</div>
                <div>Mail</div>
                <div>Teléfono</div>
                <div>Zonas</div>
                <div>Servicios</div>
              </div>
            </div>
            <div className="table-body">
              {
                [0,0,0,0,0,0,0].map((user, index) =>
                  <div className="table-item" key={index}>
                    <div className="bold">Nombre Apellido</div>
                    <div>nombre@dominio.com</div>
                    <div>+52 55 983 89 23</div>
                    <div>Centro, Sur</div>
                    <div>Accesos, Flujo vehícular</div>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Users.propTypes = {

}

export default Users
