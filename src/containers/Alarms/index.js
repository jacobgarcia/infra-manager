import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { DateUtils } from 'react-day-picker'
import Slider from 'react-slick'
import domtoimage from 'dom-to-image'
import { Table, RiskBar, DateRangePicker } from 'components'
import * as FileSaver from 'file-saver'

import { NetworkOperation } from 'lib'

import { setReport, setHistory, setAlarm, setAlarms, deleteAlarms } from 'actions'

import io from 'socket.io-client'

class Alarms extends Component {
  constructor(props) {
    super(props)

    const { alarmId } = props.match.params
    this.props.alarms
      .sort(($0, $1) => {
        return $0.timestamp - $1.timestamp
      })
      .reverse()
    this.state = {
      selectedLog:
        this.props.alarms.length > 0 && alarmId
          ? this.props.alarms.find($0 => $0._id === alarmId)
          : this.props.alarms[0],
      selectedElementIndex:
        this.props.alarms.length > 0 && alarmId
          ? [this.props.alarms.findIndex($0 => $0._id === alarmId), 1]
          : [0, 1],
      showLogDetail: true,
      from: new Date(),
      to: new Date()
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.props.alarms || this.props.alarms.length === 0) {
      if (nextProps.alarms && nextProps.alarms.length > 0) {
        this.setState({
          selectedLog: nextProps.alarms.length > 0 ? nextProps.alarms[0] : null,
          selectedElementIndex: nextProps.alarms.length > 0 ? [0, 0] : [null, null],
          showLogDetail: true
        })
      }
    }
  }

  componentDidMount() {
    // Start socket connection
    this.initSockets(this.props)
    const from = new Date(new Date().toLocaleDateString()).getTime()
    const to = new Date(new Date().toLocaleDateString()).getTime() + 86400000
    // Clean alarms array
    this.props.deleteAlarms()
    NetworkOperation.getReports(from, to).then(({ data }) => {
      data.reports.map(report => {
        this.props.setReport(report)
        // Populate history array
        report.history.map(currentHistory => {
          currentHistory.site = report.site.key
          currentHistory.zone = report.zone
          this.props.setHistory(currentHistory)
        })
        // Populate alarms array
        this.props.setAlarms(report.alarms)
      })
    })
  }

  initSockets() {
    this.socket = io()

    this.socket.on('connect', () => {
      this.socket.emit('join', this.props.credentials.company.name)
    })
  }

  onLogSelect = (item, index, sectionIndex) => {
    this.setState({
      showLogDetail: true,
      selectedLog: item,
      selectedElementIndex: [index, sectionIndex]
    })
  }

  onDownload = () => {
    const image = document.getElementById('image')
    domtoimage.toBlob(image).then(photo => {
      FileSaver.saveAs(photo, `${new Date(this.state.selectedLog.timestamp).getTime()}.png`)
    })
  }
  getReports = (from, to) => {
    NetworkOperation.getReports(from, to).then(({ data }) => {
      data.reports.map(report => {
        this.props.setReport(report)
        // Populate history array
        report.history.map(currentHistory => {
          currentHistory.site = report.site.key
          currentHistory.zone = report.zone
          this.props.setHistory(currentHistory)
        })
        // Populate alarms array
        this.props.setAlarms(report.alarms)
      })
    })
  }
  onDayClick = day => {
    // TODO Network operation for selected period
    const range = DateUtils.addDayToRange(day, this.state)
    this.setState(range, () => {
      this.setTableElements()
    })
  }

  downloadReport = () => {
    NetworkOperation.getAlarmsReports().then(response => {
      const blob = new Blob([response.data], {
        type: 'text/plain;charset=utf-8'
      })
      FileSaver.saveAs(blob, new Date().toLocaleDateString() + 'report.csv')
    })
  }

  downloadOtherReport = () => {
    NetworkOperation.getOtherReport().then(response => {
      const blob = new Blob([response.data], {
        type: 'text/plain;charset=utf-8'
      })
      FileSaver.saveAs(blob, new Date().toLocaleDateString() + 'report.csv')
    })
  }

  downloadSummery = () => {
    NetworkOperation.getAlarmsSummery('PANA-MA').then(response => {
      const blob = new Blob([response.data], {
        type: 'text/plain;charset=utf-8'
      })
      FileSaver.saveAs(blob, new Date().toLocaleDateString() + 'resumen.csv')
    })
  }

  setTableElements = () => {
    const { state } = this
    // Clean alarms array
    this.props.deleteAlarms()
    if (!state.to && !state.from) return this.getReports(null, null)
    else if (!state.to) return this.getReports(state.from.getTime() - 43200000, state.from.getTime() + 43200000)
    return this.getReports(state.from.getTime() - 43200000, state.to.getTime() + 43200000)
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
            <div className={`log-detail-container ${state.showLogDetail ? '' : 'hidden'}`}>
              <div className="content">
                <div className="time-location">
                  <p>
                    {state.selectedLog &&
                      state.selectedLog.timestamp &&
                      new Date(state.selectedLog.timestamp).toLocaleString()}
                  </p>
                  {state.selectedLog &&
                    state.selectedLog.zone && (
                      <p>
                        Zona <span>{state.selectedLog && state.selectedLog.zone.name}</span> Sitio{' '}
                        <span>{state.selectedLog && state.selectedLog.site}</span>
                      </p>
                    )}
                </div>
                <div className="detail">
                  <span>IMAGENES RELACIONADAS</span>
                  <Slider nextArrow={<button>{'>'}</button>} prevArrow={<button>{'<'}</button>}>
                    {state.selectedLog &&
                    state.selectedLog.photos &&
                    state.selectedLog.photos.length > 0 ? (
                      state.selectedLog.photos.map((photo, index) => {
                        return (
                          <div
                            key={index}
                            id="image"
                            className="image-slider"
                            style={{
                              backgroundImage: `url(https://demo.connus.mx` + photo + `)`
                            }}
                          />
                        )
                      })
                    ) : (
                      <div
                        id="image"
                        className="image-slider"
                        style={{
                          backgroundImage: `url(https://demo.connus.mx/static/img/icons/not-available.png)`
                        }}
                      />
                    )}
                  </Slider>
                </div>
                <div className="details-container">
                  <div className="detail">
                    <span>Hora del suceso</span>
                    <p>
                      {state.selectedLog &&
                        new Date(state.selectedLog.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="detail">
                    <span>Tipo de alerta</span>
                    <p>{state.selectedLog && state.selectedLog.event}</p>
                  </div>
                  <div className="detail">
                    <span>Nivel de Riesgo</span>
                    <p>{state.selectedLog && state.selectedLog.risk}</p>
                  </div>
                  <div className="detail">
                    <span>Estatus</span>
                    <p>{state.selectedLog && state.selectedLog.status}</p>
                  </div>
                  <div className="detail">
                    <p>{state.selectedLog && state.selectedLog._id}</p>
                    <span>Código único de identificación</span>
                  </div>
                </div>
                <div className="action download">
                  <p className="detail" onClick={this.onDownload}>
                    Descargar Foto
                  </p>
                </div>
              </div>
            </div>
            <div className="tables-container">
              <Table
                className={`${state.showLogDetail ? 'detailed' : ''}`}
                selectedElementIndex={state.selectedElementIndex}
                actionsContainer={
                  <div>
                    {this.props.credentials.company.name === 'Puma' ? (
                      <p className="button action" onClick={this.downloadReport}>
                        Descargar Reporte
                      </p>
                    ) : (
                      <p className="button action" onClick={this.downloadOtherReport}>
                        Descargar Reporte
                      </p>
                    )}
                    {this.props.credentials.company.name === 'Puma' && (
                      <p className="button action" onClick={this.downloadSummery}>
                        Descargar Resumen
                      </p>
                    )}

                    <DateRangePicker from={state.from} to={state.to} onDayClick={this.onDayClick} />
                  </div>
                }
                element={(item, index) => (
                  <div
                    className={`table-item ${
                      state.selectedElementIndex[0] === index && state.selectedElementIndex[1] === 1
                        ? 'selected'
                        : ''
                    }`}
                    key={index}
                    onClick={() => this.onLogSelect(item, index, 1)}
                  >
                    <div className="medium">{new Date(item.timestamp).toLocaleDateString()}</div>
                    <div className="large">{item.event}</div>
                    {/* <div className="hiddable">{item.zone.name}</div> */}
                    <div className="hiddable">{item.site}</div>
                    <div>
                      <RiskBar risk={item.risk} />
                    </div>
                    <div className="large hiddable">{item.status}</div>
                    <div className="medium">{item.key}</div>
                  </div>
                )}
                title="Alertas"
                elements={props.alarms.sort(($0, $1) => $0.timestamp - $1.timestamp)}
                titles={[
                  { title: 'Tiempo', className: 'medium' },
                  { title: 'Suceso', className: 'large' },
                  { title: 'Sitio', className: 'hiddable' },
                  { title: 'Riesgo' },
                  { title: 'Estatus o acción', className: 'large hiddable' },
                  { title: 'ID', className: 'medium' }
                ]}
              />
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
                    onClick={() => this.onLogSelect(item, index, sectionIndex)}
                  >
                    <div className="medium">{new Date(item.timestamp).toLocaleDateString()}</div>
                    <div className="large">{item.event}</div>
                    <div className="hiddable">{item.site}</div>
                    <div className="large hiddable">{item.status}</div>
                    <div className="medium">{item.key}</div>
                  </div>
                )}
                title="Historial"
                elements={props.history}
                titles={[
                  { title: 'Tiempo', className: 'medium' },
                  { title: 'Suceso', className: 'large' },
                  { title: 'Sitio', className: 'hiddable' },
                  { title: 'Estatus o acción', className: 'large hiddable' },
                  { title: 'ID', className: 'medium' }
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
  history: PropTypes.object,
  alarms: PropTypes.array,
  location: PropTypes.object,
  match: PropTypes.string,
  credentials: PropTypes.object,
  setReport: PropTypes.func,
  setHistory: PropTypes.func,
  setAlarm: PropTypes.func,
  setAlarms: PropTypes.func,
  deleteAlarms: PropTypes.func
}

function mapDispatchToProps(dispatch) {
  return {
    setReport: report => {
      dispatch(setReport(report))
    },
    setHistory: history => {
      dispatch(setHistory(history))
    },
    setAlarm: alarm => {
      dispatch(setAlarm(alarm))
    },
    setAlarms: alarms => {
      dispatch(setAlarms(alarms))
    },
    deleteAlarms: () => {
      dispatch(deleteAlarms())
    }
  }
}

function mapStateToProps({ zones, history, alarms, credentials }) {
  return {
    zones,
    history,
    alarms,
    credentials
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Alarms)
