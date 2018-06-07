import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { DateUtils } from 'react-day-picker'

import { Table, RiskBar } from 'components'

import io from 'socket.io-client'

class Alarms extends Component {
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

  UNSAFE_componentWillReceiveProps(nextProps) {
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

  initSockets() {
    this.socket = io()

    this.socket.on('connect', () => {
      this.socket.emit('join', 'connus')
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
          <title>Connus | Centro de Alertas</title>
        </Helmet>
        <div className="content">
          <h2>Centro de Alertas</h2>
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
                  <span>IMAGENES RELACIONADAS</span>
                  <div
                    className="image-slider"
                    style={{
                      backgroundImage: `url(https://demo.connus.mx${
                        state.selectedLog.photos
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
                    <span>Tipo de alerta</span>
                    <p>{state.selectedLog.event}</p>
                  </div>
                  <div className="detail">
                    <span>Nivel de Riesgo</span>
                    <p>{state.selectedLog.risk}</p>
                  </div>
                  <div className="detail">
                    <span>Estatus</span>
                    <p>{state.selectedLog.status}</p>
                  </div>
                  <div className="detail">
                    <span>Código único de identificación</span>
                    <p>{state.selectedLog._id}</p>
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
                    <div className="hiddable">{item.site}</div>
                    <div className="large hiddable">{item.status}</div>
                  </div>
                )}
                title="Historial"
                elements={props.history}
                titles={[
                  { title: 'Tiempo', className: 'medium' },
                  { title: 'Suceso', className: 'large' },
                  { title: 'Sitio', className: 'hiddable' },
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
                elements={props.alarms}
                titles={[
                  { title: 'Tiempo', className: 'medium' },
                  { title: 'Suceso', className: 'large' },
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

Alarms.propTypes = {
  facialReports: PropTypes.array,
  history: PropTypes.array,
  alarms: PropTypes.array
}

function mapStateToProps({ zones, facialReports, history, alarms }) {
  return {
    zones,
    facialReports,
    history,
    alarms
  }
}

export default connect(mapStateToProps)(Alarms)
