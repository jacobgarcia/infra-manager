import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { DateUtils } from 'react-day-picker'

import { Table, RiskBar, DateRangePicker } from '../components'
import { setFacialReport } from '../actions'

import { NetworkOperation, NetworkOperationFRM } from '../lib'
import io from 'socket.io-client'

class Inventory extends Component {
  constructor(props) {
    super(props)

    this.state = {
      logs: this.props.facialReports,
      selectedLog: this.props.facialReports.length > 0 ? this.props.facialReports[0] : {},
      selectedElementIndex: this.props.facialReports.length > 0 ? [0,0] : [null,null],
      showLogDetail: true,
      from: new Date(),
      to: new Date()
    }

    this.onLogSelect = this.onLogSelect.bind(this)
    this.onDayClick = this.onDayClick.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.facialReports || this.props.facialReports.length === 0) {
      if (nextProps.facialReports && nextProps.facialReports.length > 0) {
        this.setState({
          selectedLog: nextProps.facialReports.length > 0 ? nextProps.facialReports[0] : null,
          selectedElementIndex: nextProps.facialReports.length > 0 ? [0,0] : [null,null],
          showLogDetail: true,
        })
      }
    }
  }

  componentDidMount() {
    // Start socket connection
    this.initSockets(this.props)
  }

  // TODO: Clean this mess and do it at App (using redux)
  initSockets(props) {
    this.socket = io('https://connus.be')

    this.socket.on('connect', () => {
      this.socket.emit('join', 'connus')
    })
  }

  onLogSelect(item, index, sectionIndex) {
    this.setState({
      showLogDetail: true,
      selectedLog: item,
      selectedElementIndex: [index, sectionIndex]
    })
  }

  onDayClick(day) {
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
          <h2>Inventario</h2>
          <div className="tables-detail__container">
            <div className={`log-detail-container ${state.showLogDetail ? '' : 'hidden'}`}>
              <div className="content">
                <div className="time-location">
                <p>{state.selectedLog.timestamp && new Date(state.selectedLog.timestamp).toLocaleString()}</p>
                  {state.selectedLog.zone && <p>Zona <span>{state.selectedLog.zone.name}</span> Sitio <span>{state.selectedLog.site}</span></p>}
                </div>
                <div className="detail">
                  <span>Componente</span>
                  <div className="image-slider" style={{backgroundImage: `url(https://connus.be${state.selectedLog.photo})`}} />
                </div>
                <div className="details-container">
                  <div className="detail">
                    <span>Nombre del componente</span>
                    <p>{new Date(state.selectedLog.timestamp).toLocaleTimeString()}</p>
                  </div>
                  <div className="detail">
                    <span>Marca</span>
                    <p>{state.selectedLog.access}</p>
                  </div>
                  <div className="detail">
                    <span>Modelo</span>
                    <p>{state.selectedLog.pin}</p>
                  </div>
                  <div className="detail">
                    <span>Tipo</span>
                    <p>{state.selectedLog.success ? 'Si' : 'No'}</p>
                  </div>
                  <div className="detail">
                    <span>Estatus</span>
                    <p>{state.selectedLog.status}</p>
                  </div>
                  <div className="detail">
                    <span>Identificador</span>
                    <p>{state.selectedLog.id}</p>
                  </div>
                  <div className="detail">
                    <span>Version</span>
                    <p>{state.selectedLog.id}</p>
                  </div>
                  <div className="detail">
                    <span>Id Fabricante</span>
                    <p>{state.selectedLog.id}</p>
                  </div>
                  <div className="detail">
                    <span>Modelo Fabricante</span>
                    <p>{state.selectedLog.id}</p>
                  </div>
                  <div className="detail">
                    <span>Estatus Detallados</span>
                    <p>{state.selectedLog.status}</p>
                  </div>
                </div>
                <div>
                  <label htmlFor="">Ultimo Mantenimiento</label>
                  <input type="text" value={null} />
                </div>
                <div>
                  <label htmlFor="">Persona de mantenimiento</label>
                  <input type="text" value={null} />
                </div>
                <div>
                  <label htmlFor="">Supervisor de Mantenimiento</label>
                  <input type="text" value={null} />
                </div>
                <div>
                  <label htmlFor="">Tiempo de mantenimiento</label>
                  <input type="text" value={null} />
                </div>
                <div>
                  <label htmlFor="">Siguiente Mantenimiento</label>
                  <input type="text" value={null} />
                </div>
                <div>
                  <label htmlFor="">Lugar de mantenimiento</label>
                  <input type="text" value={null} />
                </div>
                <div>
                  <label htmlFor="">Tipo de Mantenimiento</label>
                  <input type="text" value={null} />
                </div>
                { state.selectedLog.risk > 0 &&
                  <div className="action destructive">
                    <p>Contactar seguridad</p>
                  </div>
                }
              </div>
            </div>
            <div className="tables-container">
              <Table
                className={`${state.showLogDetail ? 'detailed' : ''}`}
                selectedElementIndex={state.selectedElementIndex}
                element={(item, index, sectionIndex) =>
                  <div className={`table-item ${state.selectedElementIndex[0] === index && state.selectedElementIndex[1] === sectionIndex ? 'selected' : ''}`}
                    key={index}
                    onClick={() => this.onLogSelect(item, index, sectionIndex)}>
                    <div className="medium">{new Date(item.timestamp).toLocaleDateString()}</div>
                    <div className="large">{item.event}</div>
                    {/* <div className="hiddable">{item.zone.name}</div> */}
                    <div className="hiddable">{item.site}</div>
                    {/* <div><RiskBar risk={item.risk} /></div> */}
                    <div className="large hiddable">{item.status}</div>
                  </div>
                }
                title="Registros"
                elements={props.facialReports.filter($0 => $0.risk === 0)}
                titles={[
                  {title: 'Tiempo', className: 'medium'},
                  {title: 'Suceso', className: 'large'},
                  // {title: 'Zona', className: 'hiddable'},
                  {title: 'Sitio', className: 'hiddable'},
                  // {title: 'Riesgo'},
                  {title: 'Estatus o acción', className: 'large hiddable'}
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Inventory.propTypes = {
  setFacialReport: PropTypes.func,
  facialReports: PropTypes.array
}

function mapStateToProps({ zones, facialReports }) {
  return {
    zones,
    facialReports
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setFacialReport: (timestamp, event, success, risk, zone, status, site, access, pin, photo, id) => {
      dispatch(setFacialReport(timestamp, event, success, risk, zone, status, site, access, pin, photo, id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Inventory)
