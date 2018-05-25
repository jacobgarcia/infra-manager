import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { DateUtils } from 'react-day-picker'

import { Table, RiskBar } from 'components'
import { setFacialReport } from 'actions'

import io from 'socket.io-client'

class FacialRecognition extends Component {
  static propTypes = {
    setFacialReport: PropTypes.func,
    facialReports: PropTypes.array
  }

  state = {
    logs: this.props.facialReports,
    selectedLog:
      this.props.facialReports.length > 0 ? this.props.facialReports[0] : {},
    selectedElementIndex:
      this.props.facialReports.length > 0 ? [0, 0] : [null, null],
    showLogDetail: true,
    from: new Date(),
    to: new Date()
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.facialReports || this.props.facialReports.length === 0) {
      if (nextProps.facialReports && nextProps.facialReports.length > 0) {
        this.setState({
          selectedLog:
            nextProps.facialReports.length > 0
              ? nextProps.facialReports[0]
              : null,
          selectedElementIndex:
            nextProps.facialReports.length > 0 ? [0, 0] : [null, null],
          showLogDetail: true
        })
      }
    }
  }

  componentDidMount() {
    // Start socket connection
    this.initSockets(this.props)
  }

  // TODO: Clean this mess and do it at App (using redux)
  initSockets() {
    this.socket = io('http://localhost')

    this.socket.on('connect', () => {
      this.socket.emit('join', 'connus')
    })

    this.socket.on('photo', data => {
      // Build object from recieved data
      // const report = {
      //   timestamp: new Date(),
      //   event: data.success
      //     ? 'Registro de personal exitoso'
      //     : 'Intento de registro de personal',
      //   zone: {
      //     name: 'Centro'
      //   },
      //   site: data.site,
      //   risk: data.success ? 0 : 1,
      //   status: data.success
      //     ? 'Usuario satisfactoriamente registrado'
      //     : 'Regsitro denegado. Fallo en la detección de rostro',
      //   access: 'Registro',
      //   id: '5a4ea71050fdf1191fc71af8',
      //   match: data.success ? 'Si' : 'No',
      //   authorized: data.pin,
      //   photo: data.photo
      // }

      console.log(data)
      // Add the recieved element to the props
      // this.props.setFacialReport(report.timestamp, report.event, report.success, report.risk, report.zone, report.status, report.site, report.access, report.pin, report.photo, report.id)
    })

    this.socket.on('login', data => {
      // Build object from recieved data
      const report = {
        timestamp: new Date(),
        event:
          data.status === true
            ? 'Inicio de sesión exitoso'
            : 'Intento de inicio de sesión',
        zone: {
          name: 'Centro'
        },
        site: 'MEXJIL1152', // Hardcoded site
        risk: data.status === true ? 0 : 2,
        status:
          data.status === true
            ? 'Acceso autorizado. Sensorización desactivada'
            : 'Acceso denegado. Almacenando y analizando rostro desconocido',
        access: 'Inicio de sesión',
        id: '5a4ea71050fdf1191fc71af8',
        match: data.status === true ? 'Si' : 'No',
        authorized: data.pin,
        photo: data.photo
      }

      // Add the recieved element to the props
      this.props.setFacialReport(
        report.timestamp,
        report.event,
        report.success,
        report.risk,
        report.zone,
        report.status,
        report.site,
        report.access,
        report.pin,
        report.photo,
        report.id
      )
    })

    this.socket.on('outlog', data => {
      console.log('Register element recieved from external server', { data })

      // Build object from recieved data
      const report = {
        timestamp: new Date(),
        event:
          data.status === true
            ? 'Registro de salida exitosa'
            : 'Intento de registro de salida',
        zone: {
          name: 'Centro'
        },
        site: 'MEXJIL1152', // Hardcoded site
        risk: data.status === true ? 0 : 2,
        status:
          data.status === true
            ? 'Acceso autorizado. Sensorización reactivada'
            : 'Acceso denegado. Almacenando y analizando rostro desconocido',
        access: 'Cierre de sesión',
        id: '5a4ea71050fdf1191fc71af8',
        match: data.status === true ? 'Si' : 'No',
        authorized: data.pin,
        photo: data.photo
      }
      // Add the recieved element to the props
      this.props.setFacialReport(
        report.timestamp,
        report.event,
        report.success,
        report.risk,
        report.zone,
        report.status,
        report.site,
        report.access,
        report.pin,
        report.photo,
        report.id
      )
    })
  }

  onLogSelect = (item, index, sectionIndex) => {
    this.setState({
      showLogDetail: true,
      selectedLog: item,
      selectedElementIndex: [index, sectionIndex]
    })
  }

  onDayClick = day => {
    // TODO Network operation for selected period
    const range = DateUtils.addDayToRange(day, this.state)
    this.setState(range)
  }

  render() {
    const { state, props } = this

    return (
      <div className="app-content facial-recognition small-padding">
        <Helmet>
          <title>Connus | Reconocimiento Facial</title>
        </Helmet>
        <div className="content">
          <h2>Reconocimiento Facial</h2>
          <div className="tables-detail__container">
            <div
              className={`log-detail-container ${
                state.showLogDetail ? '' : 'hidden'
              }`}>
              <div className="content">
                <div className="time-location">
                  <p>
                    {state.selectedLog.timestamp &&
                      new Date(state.selectedLog.timestamp).toLocaleString()}
                  </p>
                  {state.selectedLog.zone && (
                    <p>
                      Zona <span>{state.selectedLog.zone.name}</span> Sitio{' '}
                      <span>{state.selectedLog.site}</span>
                    </p>
                  )}
                </div>
                <div className="detail">
                  <span>Rostro detectado</span>
                  <div
                    className="image-slider"
                    style={{
                      backgroundImage: `url(https://demo.connus.mx${
                        state.selectedLog.photo
                      })`
                    }}
                  />
                </div>
                <div className="details-container">
                  <div className="detail">
                    <span>Hora del suceso</span>
                    <p>
                      {new Date(
                        state.selectedLog.timestamp
                      ).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="detail">
                    <span>Tipo de ingreso</span>
                    <p>{state.selectedLog.access}</p>
                  </div>
                  <div className="detail">
                    <span>Usuario Autorizado</span>
                    <p>{state.selectedLog.pin}</p>
                  </div>
                  <div className="detail">
                    <span>Coincide con registro</span>
                    <p>{state.selectedLog.success ? 'Si' : 'No'}</p>
                  </div>
                  <div className="detail">
                    <span>Estatus</span>
                    <p>{state.selectedLog.status}</p>
                  </div>
                  <div className="detail">
                    <span>Código único de identificación</span>
                    <p>{state.selectedLog.id}</p>
                    {/* <img src="" alt=""/> */}
                  </div>
                </div>
                {state.selectedLog.risk > 0 && (
                  <div className="action destructive">
                    <p>Contactar seguridad</p>
                  </div>
                )}
              </div>
            </div>
            <div className="tables-container">
              <Table
                className={`${state.showLogDetail ? 'detailed' : ''}`}
                selectedElementIndex={state.selectedElementIndex}
                element={(item, index, sectionIndex) => (
                  <div
                    className={`table-item ${
                      state.selectedElementIndex[0] === index &&
                      state.selectedElementIndex[1] === sectionIndex
                        ? 'selected'
                        : ''
                    }`}
                    key={index}
                    onClick={() => this.onLogSelect(item, index, sectionIndex)}>
                    <div className="medium">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </div>
                    <div className="large">{item.event}</div>
                    {/* <div className="hiddable">{item.zone.name}</div> */}
                    <div className="hiddable">{item.site}</div>
                    {/* <div><RiskBar risk={item.risk} /></div> */}
                    <div className="large hiddable">{item.status}</div>
                  </div>
                )}
                title="Registros"
                elements={props.facialReports.filter($0 => $0.risk === 0)}
                titles={[
                  { title: 'Tiempo', className: 'medium' },
                  { title: 'Suceso', className: 'large' },
                  // {title: 'Zona', className: 'hiddable'},
                  { title: 'Sitio', className: 'hiddable' },
                  // {title: 'Riesgo'},
                  { title: 'Estatus o acción', className: 'large hiddable' }
                ]}
              />
              <Table
                className={`${state.showLogDetail ? 'detailed' : ''}`}
                selectedElementIndex={state.selectedElementIndex}
                element={(item, index) => (
                  <div
                    className={`table-item ${
                      state.selectedElementIndex[0] === index &&
                      state.selectedElementIndex[1] === 1
                        ? 'selected'
                        : ''
                    }`}
                    key={index}
                    onClick={() => this.onLogSelect(item, index, 1)}>
                    <div className="medium">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </div>
                    <div className="large">{item.event}</div>
                    {/* <div className="hiddable">{item.zone.name}</div> */}
                    <div className="hiddable">{item.site}</div>
                    <div>
                      <RiskBar risk={item.risk} />
                    </div>
                    <div className="large hiddable">{item.status}</div>
                  </div>
                )}
                title="Alertas"
                elements={props.facialReports.filter($0 => $0.risk > 0)}
                titles={[
                  { title: 'Tiempo', className: 'medium' },
                  { title: 'Suceso', className: 'large' },
                  // {title: 'Zona', className: 'hiddable'},
                  { title: 'Sitio', className: 'hiddable' },
                  { title: 'Riesgo' },
                  { title: 'Estatus o acción', className: 'large hiddable' }
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ zones, facialReports }) {
  return {
    zones,
    facialReports
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setFacialReport: (
      timestamp,
      event,
      success,
      risk,
      zone,
      status,
      site,
      access,
      pin,
      photo,
      id
    ) => {
      dispatch(
        setFacialReport(
          timestamp,
          event,
          success,
          risk,
          zone,
          status,
          site,
          access,
          pin,
          photo,
          id
        )
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FacialRecognition)
