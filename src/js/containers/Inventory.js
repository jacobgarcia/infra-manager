import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { DateUtils, DayPicker } from 'react-day-picker'
import Slider from 'react-slick'

import { Table, RiskBar, DateRangePicker } from '../components'
import { setFacialReport, setInventoryReport } from '../actions'

import { NetworkOperation, NetworkOperationFRM } from '../lib'
import io from 'socket.io-client'

class Inventory extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedLog: this.props.inventoryReports.length > 0 ? this.props.inventoryReports[0] : null,
      selectedElementIndex: this.props.inventoryReports.length > 0 ? [0,0] : [null,null],
      showLogDetail: true,
      from: new Date(),
      last_from: new Date(),
      last_to: new Date(),
      next_from: new Date(),
      next_to: new Date(),
      maintenance: [],
      kind: '',
      mantainer: ''
    }

    this.options = {

    }

    this.onLogSelect = this.onLogSelect.bind(this)
    this.onDayClick = this.onDayClick.bind(this)
    this.onUpdateEntry = this.onUpdateEntry.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onSensorName = this.onSensorName.bind(this)
    this.onSensorBrand = this.onSensorBrand.bind(this)
    this.onSensorModel = this.onSensorModel.bind(this)
    this.onSensorMaker = this.onSensorMaker.bind(this)
    this.onSensorPhoto = this.onSensorPhoto.bind(this)
  }

  onSensorName(sensor) {
    let sensorName = ''
    switch (sensor) {
      case 'cs':
        sensorName = 'Sensor de contacto'
        break;
      case 'vs':
        sensorName = 'Sensor de vibración'
        break;
      case 'bs':
        sensorName = 'UPS'
        break;
      case 'fs':
        sensorName = 'Tanque de combustible'
        break;
      case 'cu':
        sensorName = 'UPS'
        break;
      case 'ts':
        sensorName = 'Aire acondicionado'
        break;
      default:
        sensorName = 'N/A'
    }

    return sensorName
  }

  onSensorBrand(sensor) {
    let sensorName = ''
    switch (sensor) {
      case 'cs':
        sensorName = 'iSmart'
        break;
      case 'vs':
        sensorName = 'OEM'
        break;
      case 'bs':
        sensorName = 'APS'
        break;
      case 'fs':
        sensorName = 'Turk'
        break;
      case 'cu':
        sensorName = 'APC'
        break;
      case 'ts':
        sensorName = 'LG'
        break;
      default:
        sensorName = 'N/A'
    }

    return sensorName
  }

  onSensorModel(sensor) {
    let sensorName = ''
    switch (sensor) {
      case 'cs':
        sensorName = '2PK'
        break;
      case 'vs':
        sensorName = 'SW-420'
        break;
      case 'bs':
        sensorName = 'Pro 1000'
        break;
      case 'fs':
        sensorName = 'OE: 3982793'
        break;
      case 'cu':
        sensorName = 'Pro 1000'
        break;
      case 'ts':
        sensorName = 'ARTMIRCC18'
        break;
      default:
        sensorName = 'N/A'
    }

    return sensorName
  }

  onSensorMaker(sensor) {
    let sensorName = ''
    switch (sensor) {
      case 'cs':
        sensorName = 'DWS3R'
        break;
      case 'vs':
        sensorName = 'SW420'
        break;
      case 'bs':
        sensorName = 'APCHL1289'
        break;
      case 'fs':
        sensorName = 'OE3490'
        break;
      case 'cu':
        sensorName = 'APCHL1289'
        break;
      case 'ts':
        sensorName = 'LGCC18'
        break;
      default:
        sensorName = 'N/A'
    }

    return sensorName
  }

  onSensorPhoto(sensor) {
    let sensorName = ''
    switch (sensor) {
      case 'cs':
        sensorName = '/static/img/dummy/contact-sensor.jpg'
        break;
      case 'vs':
        sensorName = '/static/img/dummy/vibration-sensor.jpg'
        break;
      case 'bs':
        sensorName = '/static/img/dummy/ups-sensor.jpg'
        break;
      case 'fs':
        sensorName = '/static/img/dummy/fuel-sensor.jpg'
        break;
      case 'cu':
        sensorName = '/static/img/dummy/ups-sensor.jpg'
        break;
      case 'ts':
        sensorName = '/static/img/dummy/air-sensor.jpg'
        break;
      default:
        sensorName = 'N/A'
    }

    return sensorName
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.inventoryReports || this.props.inventoryReports.length === 0) {
      if (nextProps.inventoryReports && nextProps.inventoryReports.length > 0) {
        this.setState({
          selectedLog: nextProps.inventoryReports.length > 0 ? nextProps.inventoryReports[0] : null,
          selectedElementIndex: nextProps.inventoryReports.length > 0 ? [0,0] : [null,null],
          showLogDetail: true,
        })
      }
    }
  }

  componentDidMount() {
    NetworkOperation.getInventory()
    .then(({data}) => {
      data.sites.map(site => {
        // Since each site has multiple sensors, map sensors now
        site.sensors.map(sensor => {
          const inventoryLog = {
            zone: {
              name: 'Centro'
            },
            site: site.key,
            name: this.onSensorName(sensor.key.substring(0,2)),
            brand: this.onSensorBrand(sensor.key.substring(0,2)),
            model: this.onSensorModel(sensor.key.substring(0,2)),
            type: 'Analogico',
            status: 'Activo',
            _id: Math.floor(Math.random() * Math.floor(10000)),
            version: '1.0',
            makerId: this.onSensorMaker(sensor.key.substring(0,2)),
            photo: this.onSensorPhoto(sensor.key.substring(0,2)),
            detailedStatus: {
              active: true
            }
          }
          this.props.setInventoryReport(inventoryLog)
        })
      })

      this.setState({
        selectedLog: this.props.inventoryReports[0]
      })
    })
  }

  onUpdateEntry() {
    const maintenance = {
      id: this.state.selectedLog.id,
      date: this.state.from,
      kind: this.state.kind,
      maintainer: this.state.maintainer
    }
    this.setState({
      maintenance: [...this.state.maintenance, maintenance],
      maintainer: '',
      kind: ''
    })
  }

  onChange(event) {
    const { value, name } = event.target

    this.setState({
      [name]: value,
      error: null
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
        {
          state.selectedLog &&
        <div className="content">
          <h2>Inventario</h2>
          <div className="tables-detail__container">
            <div className={`log-detail-container ${state.showLogDetail ? '' : 'hidden'}`}>
              <div className="content">
                <div className="time-location">

                <p>{state.selectedLog.name}</p>
                  {state.selectedLog.zone && <p>Zona <span>{state.selectedLog.zone.name}</span> Sitio <span>{state.selectedLog.site}</span></p>}
                </div>
                <div className="detail">
                  <span>Componente</span>
                  <Slider nextArrow={<button>{'>'}</button>} prevArrow={<button>{'<'}</button>}>
                  <div className="image-slider" style={{backgroundImage: `url(` + state.selectedLog.photo +`)` }}/>
                  <div className="image-slider" style={{backgroundImage: `url(` + state.selectedLog.photo +`)` }}/>
                    {/* <div className="image-slider 5"></div> */}
                  </Slider>                </div>
                <div className="details-container">
                  <div className="detail">
                    <span>Nombre del componente</span>
                    <p>{state.selectedLog.name}</p>
                  </div>
                  <div className="detail">
                    <span>Marca</span>
                    <p>{state.selectedLog.brand}</p>
                  </div>
                  <div className="detail">
                    <span>Modelo</span>
                    <p>{state.selectedLog.model}</p>
                  </div>
                  <div className="detail">
                    <span>Tipo</span>
                    <p>{state.selectedLog.type}</p>
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
                    <p>{state.selectedLog.version}</p>
                  </div>
                  <div className="detail">
                    <span>Id Fabricante</span>
                    <p>{state.selectedLog.makerId}</p>
                  </div>
                  <div className="detail">
                    <span>Estatus Detallados</span>
                    <p>Temperatura: {state.selectedLog.detailedStatus.temperature}</p>
                    <p>Activo: {state.selectedLog.detailedStatus.active ? 'Si' : 'No'}</p>
                  </div>
                </div>
                <Table
                  element={(item, index, sectionIndex) =>
                    <div className={`table-item`}
                      key={index}>
                      <div className="small">{new Date(item.date).toLocaleDateString()}</div>
                      <div className="small">{item.kind}</div>
                      <div className="small">{item.maintainer}</div>
                    </div>
                  }
                  title="MANTENIMIENTOS"
                  elements={state.maintenance.filter($0 => $0.id === state.selectedLog.id)}
                  titles={[
                    {title: 'Fecha', className: 'small'},
                    {title: 'Tipo', className: 'small'},
                    {title: 'Operador', className: 'small'}
                  ]}
                />
                <div>
                  <label htmlFor="">Fecha de Mantenimiento</label>
                  <div className="tables-container">
                    <DateRangePicker
                      from={state.from}
                      onDayClick={this.onDayClick}
                      className="active"
                    />
                  </div>
                </div>
                <div>
                  <input name="maintainer" type="text" placeholder="Persona de mantenimiento" value={state.maintainer} onChange={this.onChange}/>
                </div>
                <div>
                  <input name="kind" type="text" placeholder="Tipo de mantenimiento" value={state.kind} onChange={this.onChange}/>
                </div>
                <div>
                  <input name="observations" type="text" placeholder="Observaciones" value={state.observations} onChange={this.onChange}/>
                </div>
                  <div className="action destructive">
                    <p onClick={this.onUpdateEntry}>Agregar mantenimiento</p>
                  </div>
              </div>
            </div>
            <div className="tables-container">
              <Table
                className={`${state.showLogDetail ? 'detailed' : ''}`}
                actionsContainer={
                  <div>
                    <input name="filter" type="text" placeholder="Filtrar por sitio" value={state.filter} onChange={this.onChange}/>
                  </div>
                }
                selectedElementIndex={state.selectedElementIndex}
                element={(item, index, sectionIndex) =>
                  <div className={`table-item ${state.selectedElementIndex[0] === index && state.selectedElementIndex[1] === sectionIndex ? 'selected' : ''}`}
                    key={index}
                    onClick={() => this.onLogSelect(item, index, sectionIndex)}>
                    <div className="large">{item.name}</div>
                    <div className="large">{item.brand}</div>
                    <div className="large hiddable">{item.site}</div>
                    <div className="large hiddable">{item.status}</div>
                  </div>
                }
                title="Registros"
                elements={state.filter ? props.inventoryReports.filter($0 => !$0.site.indexOf(state.filter)) : props.inventoryReports}
                titles={[
                  {title: 'Nombre', className: 'medium'},
                  {title: 'Marca', className: ''},
                  {title: 'Sitio', className: 'hiddable'},
                  {title: 'Estatus', className: 'medium hiddable'}
                ]}
              />
            </div>
          </div>
        </div>
      }
      </div>
    )
  }
}

Inventory.propTypes = {
  setFacialReport: PropTypes.func,
  setInventoryReport: PropTypes.func,
  inventoryReports: PropTypes.array
}

function mapStateToProps({ zones, inventoryReports, facialReports, cameraReports }) {
  return {
    zones,
    inventoryReports,
    facialReports,
    cameraReports
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setFacialReport: (timestamp, event, success, risk, zone, status, site, access, pin, photo, id) => {
      dispatch(setFacialReport(timestamp, event, success, risk, zone, status, site, access, pin, photo, id))
    },
    setInventoryReport: report => {
      dispatch(setInventoryReport(report))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Inventory)
