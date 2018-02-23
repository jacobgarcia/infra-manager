import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { NetworkOperation, NetworkOperationFRM } from '../lib'
import { getServiceName } from '../lib/CodeExtractor'
import { DropDown } from '../components'

import io from 'socket.io-client'

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

    // this.onQuerySearch = this.onQuerySearch.bind(this)
  }

  componentDidMount() {

    // NetworkOperation.getCompanyUsers()
    // .then(({data}) => {
    //   this.setState({
    //     users: data.users,
    //     filteredUsers: data.users
    //   })
    // })

    NetworkOperationFRM.getAlerts()
    .then(({data}) => {
      this.setState({
        alerts: this.props.credentials.company.name === 'Connus' ? data.alerts.filter($0 => $0.site === 'CNHQ9094') : data.alerts.filter($0 => $0.site != 'CNHQ9094')
      })
    })

    // Start socket connection
    this.initSockets(this.props)
  }

  initSockets(props) {
    this.socket = io('https://connus.be')

    this.socket.on('connect', data => {
      console.log('CONNECT', data)
      this.socket.emit('join', 'connus')
    })

    this.socket.on('join', join => {
      console.log('JOIN', join)
    })

    this.socket.on('alert', data => {
      console.log('GOT ALERT', data)
      // NetworkOperationFRM.getAlerts()
      // .then(({data}) => {
      //   this.setState({
      //     alerts: data.alerts
      //   })
      // })
    })
  }

  // onQuerySearch(event) {
    // event.stopPropagation()
    // const { value } = event.target
    // const query = value.toLowerCase()

    // const regEx = new RegExp(`${query}`)

    // this.setState({
    //   query,
    //   filteredUsers: value.length > 0 ? this.state.users.filter($0 => JSON.stringify($0).toLowerCase().search(regEx) >= 0) : this.state.users
    // })
  // }

  // addUser(event) {
  //   event.preventDefault()
  // }

  render() {
    const { state, props } = this

    return (
      <div className="users app-content small-padding">
        <div className="alerts__container">
          {
            state.latestAlerts.map(alert =>
              <div key={alert._id} className="alert">
                <div className="alert__image">
                  {/* <img src="" alt=""/> */}
                </div>
                <div className="alert__body">
                  <p>Temperatura 80</p>
                  <p>Sitio B45, Zona 34NJ</p>
                </div>
              </div>
            )
          }
        </div>
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
