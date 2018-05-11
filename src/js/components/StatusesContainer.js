import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import {
  substractReportValues,
  getStatus,
  getFilteredReports
} from '../lib/specialFunctions'
import { ElementStatus } from './'
import { NetworkOperation } from '../lib'

import io from 'socket.io-client'



// IMPORTANT TODO if we change the site key, re-set the socket or ask to join there
class StatusesContainer extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      show: 'SENSORS',
      photo2: props.photo1,
      photo3: props.photo2,
      animate: false
    }

    this.getLink = this.getLink.bind(this)
  }

  componentWillMount() {
    // Init socket with userId and token
    this.initSocket()
  }

  initSocket() {
    this.socket = io()

    this.socket.on('connect', () => {
      this.socket.emit('join', 'connus')
    })

    this.socket.on('debugRequest', data => {
      this.setState({ animate: false })
      // if (this.props.element.key == data.camera){
      // console.log(this.props.element.key)
      // console.log(data.camera)
      this.setState({
        photo2: 'https://demo.connus.mx' + data.image2,
        photo3: 'https://demo.connus.mx' + data.image3
        // camera: data.camera
      })
      // }
    })
  }

  getLink(type, element) {

    const { zoneId, siteId } = this.props.params
    switch (type) {
      case 'GENERAL':
        return `/sites/${element._id}`
      case 'ZONE':
        return `/sites/${zoneId}/${element._id}`
      case 'SUBZONE':
        return `/sites/${zoneId}/${element._id}`
      case 'SITE':
        return `/sites/${zoneId}/${siteId}`
      default:
        return `/`
    }
  }

  getElementTitle(type) {
    switch (type) {
      case 'GENERAL':
        return 'Zona'
      case 'ZONE':
        return ''
      case 'SITE':
        return 'Sensor'
      default:
        return `Otro`
    }
  }

  onDebug() {
    this.setState({ animate: true })
    const { props } = this
    NetworkOperation.getDebug(props.element.key)
  }

  getContent() {
    const { props, state } = this

    const isSensor = props.type !== 'SITE' ? 'SENSORS' : null
    /*
    console.log(isSensor)
    console.log(state.show)
    */

    switch (isSensor || state.show) {
      case 'SENSORS':
        return props.elements && props.elements.length > 0 ? (
          props.elements.map(element => {
            const reports = substractReportValues(
              getFilteredReports(props.reports, element)
            )
            let { status, percentage, name } = getStatus(reports || null)

            if (props.type === 'SITE') {
              const sensor = substractReportValues(props.reports).sensors.find(
                ({ key }) => key === element.key
              )

              if (sensor) {
                if (sensor.key.search('cs') !== -1) {
                  status = [
                    { name: 'bold', value: sensor.value == 100 ? 'OK' : 'BAD' },
                    {
                      name: 'alerts',
                      value: sensor.value == 100 ? 'OK' : 'BAD'
                    }
                  ]
                  percentage = sensor.value == 100 ? 'OK' : 'BAD'
                } else {
                  status = [
                    { name: 'bold', value: sensor.value },
                    { name: 'alerts', value: 100 - sensor.value }
                  ]
                  percentage = sensor.value
                }
              }

              if (sensor) {
                if (
                  sensor.key.search('cs') !== -1 ||
                  sensor.key.search('vs') !== -1 ||
                  sensor.key.search('bs') !== -1
                ) {
                  status = [
                    { name: 'bold', value: sensor.value == 100 ? 'OK' : 'BAD' },
                    {
                      name: 'alerts',
                      value: sensor.value == 100 ? 'OK' : 'BAD'
                    }
                  ]
                  percentage = sensor.value == 100 ? 'OK' : 'BAD'
                } else {
                  status = [
                    { name: 'bold', value: sensor.value },
                    { name: 'alerts', value: 100 - sensor.value }
                  ]
                  percentage = sensor.value
                }
              }
            }

            switch (element.key) {
              case 'cs1':
                name = 'de contacto 1'
                break
              case 'cs2':
                name = 'de contacto 2'
                break
              case 'vs1':
                name = 'de vibración 1'
                break
              case 'vs2':
                name = 'de vibración 2'
                break
              case 'ts1':
                name = 'de temperatura'
                break
              case 'fs1':
                name = 'de combustible'
                break
              case 'bs1':
                name = 'de humedad'
                break
              case 'cu1':
                name = 'de corriente'
                break
              default:
            }

            return (
              <Link key={element._id} to={this.getLink(props.type, element)}>
                <ElementStatus
                  id={element._id}
                  title={
                    name
                      ? this.getElementTitle(props.type) + ' ' + name
                      : this.getElementTitle(props.type)
                  }
                  name={element.name}
                  type={props.type}
                  siteKey={element.key}
                  percentage={percentage} // Zone
                  status={status} // Zone
                  alarms={reports ? reports.alarms.length : 0}
                  elements={element.elements} // Subzones or sites
                  onHover={props.onHover}
                  nonPercentage={props.type === 'SITE'}
                />
              </Link>
            )
          })
        ) : (
          <div>Sin información</div>
        )
      case 'CAMERAS':
        return (
          <div className="action destructive ">
            <button className="center" onClick={() => this.onDebug()}>
              Ver Cámaras
            </button>
            <br />

            {this.state.animate && (
              <div className="loading">
                <ul className="loadinglist">
                  <li>
                    <div id="panel">
                      <span id="loading5">
                        <span id="outerCircle" />
                      </span>
                    </div>
                  </li>
                  <br />
                </ul>
              </div>
            )}

            {this.state.photo2 && (
              <div className="response">
                <img src={this.state.photo2} />
                <br />
                <img src={this.state.photo3} />
              </div>
            )}
          </div>
        )
      case 'INFO':
        return (
          props.element &&
          props.element.position && (
            <div className="info readonly">
              <div>
                <label htmlFor="">Id</label>
                <input type="text" value={props.element._id} readOnly />
              </div>
              <div>
                <label htmlFor="">Nombre</label>
                <input type="text" value={props.element.name} />
              </div>
              <div>
                <label htmlFor="">KEY</label>
                <input type="text" value={props.element.key} />
              </div>
              <div>
                <label htmlFor="">Ubicación</label>
                <input type="text" value={props.element.address} />
              </div>
              <div>
                <h4>Coordenadas</h4>
                <label htmlFor="">Latitud</label>
                <input
                  type="text"
                  value={
                    props.element.position ? props.element.position[0] : ''
                  }
                />
                <label htmlFor="">Longitud</label>
                <input
                  type="text"
                  value={
                    props.element.position ? props.element.position[1] : ''
                  }
                />
              </div>
              <div>
                <h4>Usuarios monitoreando</h4>
              </div>
              <div>
                <label>Notas</label>
                <textarea>{props.element.notes}</textarea>
              </div>
            </div>
          )
        )
      default:
        return null
    }
  }

  render() {
    const { state, props } = this
    return (
      <div className="statuses-container">
        {props.type === 'SITE' && (
          <ul className="statuses-container-nav">
            <li
              onClick={() => this.setState({ show: 'SENSORS' })}
              className={state.show === 'SENSORS' ? 'active' : ''}>
              Sensores
            </li>
            <li
              onClick={() => this.setState({ show: 'CAMERAS' })}
              className={state.show === 'CAMERAS' ? 'active' : ''}>
              Cámaras
            </li>
            <li
              onClick={() => this.setState({ show: 'INFO' })}
              className={state.show === 'INFO' ? 'active' : ''}>
              Información
            </li>
          </ul>
        )}
        <div className="content">{this.getContent()}</div>
      </div>
    )
  }
}

StatusesContainer.propTypes = {
  params: PropTypes.object,
  photo1: PropTypes.object,
  photo2: PropTypes.object
}

export default StatusesContainer
