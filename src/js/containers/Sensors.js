import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { NetworkOperation, NetworkOperationFRM } from '../lib'
import { getServiceName } from '../lib/CodeExtractor'
import { DropDown } from '../components'

class Users extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users: [],
      isAddingUser: false,
      query: '',
      filteredUsers: [],
      alerts: [],
      latestAlerts: []
    }
  }

  componentDidMount() {

    NetworkOperationFRM.getAlerts()
    .then(({data}) => {
      this.setState({
        alerts: this.props.credentials.company.name === 'Connus' ? data.alerts.filter($0 => $0.site === 'CNHQ9094') : data.alerts.filter($0 => $0.site != 'CNHQ9094')
      })
    })

    // Start socket connection
    // this.initSockets(this.props)
  }

  render() {
    const { state, props } = this

    return (
      <div className="users app-content small-padding">
        <Helmet>
          <title>Connus | Sensores</title>
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
                    <DropDown
                      elements={props.zones}
                    />
                  </div>
                  <div>
                    <label htmlFor="email">Servicios</label>
                    <DropDown
                      elements={props.credentials.company ? props.credentials.company.services.map(getServiceName) : [] }
                    />
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
          <h2>Sensores</h2>
          <div className="table">
            <div className="table-header">
              <div className="table-item">
                <div>Hora</div>
                <div>Sitio</div>
                <div>Alerta</div>
              </div>
            </div>
            <div className="table-body">
              {
                state.alerts.map((alert, index) =>
                  <div className="table-item" key={index}>
                    <div className="bold">{new Date(alert.timestamp).toLocaleString()}</div>
                    <div>{alert.site}</div>
                    <div>{alert.alert}</div>
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

function mapStateToProps({zones, credentials}) {
  return {
    zones,
    credentials
  }
}

Users.propTypes = {
  credentials: PropTypes.object
}

export default connect(mapStateToProps)(Users)
