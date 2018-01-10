import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import { NetworkOperation } from '../lib'

class Users extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users: []
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

  render() {
    const { state, props } = this
    return (
      <div className="users app-content small-padding">
        <Helmet>
          <title>Connus | Usuarios</title>
        </Helmet>
        <div className="content">
          <h2>Usuarios</h2>
          <div className="table">
            <div className="table-actions">
              <div />
              <div>
                <input type="button" value="Buscar" />
                <input type="button" value="Añadir" />
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
