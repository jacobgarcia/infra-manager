import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import { NetworkOperation } from '../lib'

class Users extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users: [],
      isAddingUser: false
    }
  }

  componentDidMount() {
    NetworkOperation.getCompanyUsers()
    .then(({data}) => {
      this.setState({
        users: data.users
      })
    })
  }

  addUser(event) {
    event.preventDefault()
  }

  render() {
    const { state, props } = this
    return (
      <div className="users app-content small-padding">
        <Helmet>
          <title>Connus | Usuarios</title>
        </Helmet>
        {
          state.isAddingUser
          &&
          <div className="popover" onClick={() => this.setState({ isAddingUser: false })}>
            <div className="popover-content" onClick={event => event.stopPropagation()}>
              <form onSubmit={this.addUser}>
                <div>
                  <h2>Añadir usuario</h2>
                  <div>
                    <label htmlFor="name">Nombre</label>
                    <input type="text" placeholder="Nombre" id="name" name="name" />
                  </div>
                  <div>
                    <label htmlFor="email">Correo electrónico</label>
                    <input type="text" placeholder="usuario@dominio.com" id="email" name="email" />
                  </div>
                  <div>
                    <label htmlFor="email">Zonas</label>
                  </div>
                  <div>
                    <label htmlFor="email">Servicios</label>
                  </div>
                  <div>
                    <label htmlFor="email">Permisos</label>
                  </div>
                </div>
                <div className="actions">
                  <input type="button" value="Cancelar" className="destructive red" onClick={() => this.setState({ isAddingUser: false })} />
                  <input type="submit" value="Guardar" className="action" />
                </div>
              </form>
            </div>
          </div>
        }
        <div className="content">
          <h2>Usuarios</h2>
          <div className="table">
            <div className="table-actions">
              <div />
              <div>
                <input type="text" placeholder="Buscar" className="search" />
                <input type="button" value="Añadir" onClick={() => this.setState({ isAddingUser: true })} />
              </div>
            </div>
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
                state.users.map((user, index) =>
                  <div className="table-item" key={index}>
                    <div className="bold">{user.name}</div>
                    <div>{user.email}</div>
                    <div>{user.phone}</div>
                    <div className="zone">{user.zones.map(({name}) => name)}</div>
                    <div></div>
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
