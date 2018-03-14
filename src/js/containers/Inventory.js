import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { DateUtils } from 'react-day-picker'
import Slider from 'react-slick'

import { Table, RiskBar, DateRangePicker } from '../components'
import { setFacialReport } from '../actions'

import { NetworkOperation, NetworkOperationFRM } from '../lib'
import io from 'socket.io-client'

class Inventory extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedLog: this.props.inventoryReports.length > 0 ? this.props.inventoryReports[0] : null,
      selectedElementIndex: this.props.inventoryReports.length > 0 ? [0,0] : [null,null],
      showLogDetail: true,
      last_from: new Date(),
      last_to: new Date(),
      next_from: new Date(),
      next_to: new Date()
    }

    this.onLogSelect = this.onLogSelect.bind(this)
    this.onDayClick = this.onDayClick.bind(this)
    this.onUpdateEntry = this.onUpdateEntry.bind(this)
    this.onChange = this.onChange.bind(this)
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
            name: sensor.key.substring(0,1) === 'c' ? 'Sensor de contacto' : 'Sensor de vibración',
            brand: sensor.key.substring(0,1) === 'c' ? 'iSmart' : 'OEM',
            model: sensor.key.substring(0,1) === 'c' ? '2PK' : 'SW-420',
            type: 'Analogico',
            status: 'Activo',
            _id: Math.floor(Math.random() * Math.floor(10000)),
            version: 1.0,
            idBrand: 'DWS3R'
          }
          console.log(inventoryLog)
        })
      })
    })
  }

  onUpdateEntry() {

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
                    <p>{state.selectedLog._id}</p>
                  </div>
                  <div className="detail">
                    <span>Version</span>
                    <p>{state.selectedLog.version}</p>
                  </div>
                  <div className="detail">
                    <span>Id Fabricante</span>
                    <p>{state.selectedLog.idBrand}</p>
                  </div>
                  <div className="detail">
                    <span>Estatus Detallados</span>
                    <p>Temperatura: {state.selectedLog.detailedStatus.temperature}</p>
                    <p>Activo: {state.selectedLog.detailedStatus.active ? 'Si' : 'No'}</p>
                  </div>
                </div>
                <div>
                  <label htmlFor="">Ultimo Mantenimiento</label>
                  <div className="tables-container">
                    <DateRangePicker
                      from={state.last_from}
                      to={state.last_to}
                      onDayClick={this.onDayClick}
                      className="active"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="">Siguiente Mantenimiento</label>
                  <div className="tables-container">
                    <DateRangePicker
                      from={state.next_from}
                      to={state.next_to}
                      onDayClick={this.onDayClick}
                      className="active"
                    />
                  </div>
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
                  <label htmlFor="">Lugar de mantenimiento</label>
                  <input type="text" value={null} />
                </div>
                <div>
                  <label htmlFor="">Tipo de Mantenimiento</label>
                  <input type="text" value={null} />
                </div>
                  <div className="action destructive">
                    <p>ACTUALIZAR INFORMACion</p>
                  </div>
              </div>
            </div>
            <div className="tables-container">
              <Table
                className={`${state.showLogDetail ? 'detailed' : ''}`}
                actionsContainer={
                  <div>
                    <input name="filter" type="text" placeholder="Filtrar" value={state.filter} onChange={this.onChange}/>
                  </div>
                }
                selectedElementIndex={state.selectedElementIndex}
                element={(item, index, sectionIndex) =>
                  <div className={`table-item ${state.selectedElementIndex[0] === index && state.selectedElementIndex[1] === sectionIndex ? 'selected' : ''}`}
                    key={index}
                    onClick={() => this.onLogSelect(item, index, sectionIndex)}>
                    <div className="large">{item.name}</div>
                    <div className="large">{item.brand}</div>
                    {/* <div className="hiddable">{item.zone.name}</div> */}
                    <div className="large hiddable">{item.site}</div>
                    {/* <div><RiskBar risk={item.risk} /></div> */}
                    <div className="large hiddable">{item.status}</div>
                  </div>
                }
                title="Registros"
                elements={state.filter ? props.inventoryReports.filter($0 => $0.site === state.filter) : props.inventoryReports}
                titles={[
                  {title: 'Nombre', className: 'medium'},
                  {title: 'Marca', className: ''},
                  // {title: 'Zona', className: 'hiddable'},
                  {title: 'Sitio', className: 'hiddable'},
                  // {title: 'Riesgo'},
                  {title: 'Estatus', className: 'medium hiddable'}
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Inventory)
