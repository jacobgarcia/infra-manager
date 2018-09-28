import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { DateUtils } from 'react-day-picker'
import Slider from 'react-slick'

import Table from 'components/Table'
import { setFacialReport, setInventoryReport } from 'actions'

import { NetworkOperation } from 'lib'

class Inventory extends Component {
  state = {
    inventoryReports: null,
    selectedLog: this.props.inventoryReports.length > 0 ? this.props.inventoryReports[0] : null,
    selectedElementIndex: this.props.inventoryReports.length > 0 ? [0, 0] : [null, null],
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

  onSensorName = sensor => {
    let sensorName = ''
    switch (sensor) {
      case 'contact':
        sensorName = 'Sensor de contacto'
        break
      case 'vibration':
        sensorName = 'Sensor de vibración'
        break
      case 'battery':
        sensorName = 'UPS'
        break
      case 'fuel':
        sensorName = 'Tanque de combustible'
        break
      case 'cpu':
        sensorName = 'UPS'
        break
      case 'temperature':
        sensorName = 'Aire acondicionado'
        break
      default:
        sensorName = 'N/A'
    }

    return sensorName
  }

  onSensorBrand = sensor => {
    let sensorName = ''
    switch (sensor) {
      case 'contact':
        sensorName = 'iSmart'
        break
      case 'vibration':
        sensorName = 'OEM'
        break
      case 'battery':
        sensorName = 'APS'
        break
      case 'fuel':
        sensorName = 'Turk'
        break
      case 'cpu':
        sensorName = 'APC'
        break
      case 'temperature':
        sensorName = 'LG'
        break
      default:
        sensorName = 'N/A'
    }

    return sensorName
  }

  onSensorModel = sensor => {
    let sensorName = ''
    switch (sensor) {
      case 'contact':
        sensorName = '2PK'
        break
      case 'vibration':
        sensorName = 'SW-420'
        break
      case 'battery':
        sensorName = 'Pro 1000'
        break
      case 'fuel':
        sensorName = 'OE: 3982793'
        break
      case 'cpu':
        sensorName = 'Pro 1000'
        break
      case 'temperature':
        sensorName = 'ARTMIRCC18'
        break
      default:
        sensorName = 'N/A'
    }

    return sensorName
  }

  onSensorMaker(sensor) {
    let sensorName = ''
    switch (sensor) {
      case 'contact':
        sensorName = 'DWS3R'
        break
      case 'vibration':
        sensorName = 'SW420'
        break
      case 'battery':
        sensorName = 'APCHL1289'
        break
      case 'fuel':
        sensorName = 'OE3490'
        break
      case 'cpu':
        sensorName = 'APCHL1289'
        break
      case 'temperature':
        sensorName = 'LGCC18'
        break
      default:
        sensorName = 'N/A'
    }

    return sensorName
  }

  onSensorPhoto(sensor) {
    let sensorName = ''
    switch (sensor) {
      case 'contact':
        sensorName = '/static/img/dummy/contact-sensor.jpg'
        break
      case 'vibration':
        sensorName = '/static/img/dummy/vibration-sensor.jpg'
        break
      case 'battery':
        sensorName = '/static/img/dummy/ups-sensor.jpg'
        break
      case 'fuel':
        sensorName = '/static/img/dummy/fuel-sensor.jpg'
        break
      case 'cpu':
        sensorName = '/static/img/dummy/ups-sensor.jpg'
        break
      case 'temperature':
        sensorName = '/static/img/dummy/air-sensor.jpg'
        break
      default:
        sensorName = 'N/A'
    }

    return sensorName
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.props.inventoryReports || this.props.inventoryReports.length === 0) {
      if (nextProps.inventoryReports && nextProps.inventoryReports.length > 0) {
        this.setState({
          selectedLog: nextProps.inventoryReports.length > 0 ? nextProps.inventoryReports[0] : null,
          selectedElementIndex: nextProps.inventoryReports.length > 0 ? [0, 0] : [null, null],
          showLogDetail: true
        })
      }
    }
  }

  componentDidMount() {
    NetworkOperation.getInventory().then(({ data }) => {
      console.log('DATA', data)
      data.sites.map(site => {
        // Since each site has multiple sensors, map sensors now
        site.sensors.map(sensor => {
          const inventoryLog = {
            zone: {
              name: 'Centro'
            },
            site: site.key,
            name: this.onSensorName(sensor.class),
            brand: this.onSensorBrand(sensor.class),
            model: this.onSensorModel(sensor.class),
            type: 'Analogico',
            status: 'Activo',
            _id: Math.floor(Math.random() * Math.floor(10000)),
            version: '1.0',
            makerId: this.onSensorMaker(sensor.class),
            photo: this.onSensorPhoto(sensor.class),
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

  onUpdateEntry = () => {
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

  onChange = event => {
    const { value, name } = event.target

    this.setState({
      [name]: value,
      error: null
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
        {state.selectedLog && (
          <div className="content">
            <h2>Inventario</h2>
            <div className="tables-detail__container">
              <div className={`log-detail-container ${state.showLogDetail ? '' : 'hidden'}`}>
                <div className="content">
                  <div className="time-location">
                    <p>{state.selectedLog.name}</p>
                    {state.selectedLog.zone && (
                      <p>
                        Zona <span>{state.selectedLog.zone.name}</span> Sitio{' '}
                        <span>{state.selectedLog.site}</span>
                      </p>
                    )}
                  </div>
                  <div className="detail">
                    <span>Componente</span>
                    <Slider nextArrow={<button>{'>'}</button>} prevArrow={<button>{'<'}</button>}>
                      <div
                        className="image-slider"
                        style={{
                          backgroundImage: `url(` + state.selectedLog.photo + `)`
                        }}
                      />
                      <div
                        className="image-slider"
                        style={{
                          backgroundImage: `url(` + state.selectedLog.photo + `)`
                        }}
                      />
                    </Slider>{' '}
                  </div>
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
                  </div>
                </div>
              </div>
              <div className="tables-container">
                <Table
                  className={`${state.showLogDetail ? 'detailed' : ''}`}
                  actionsContainer={
                    <div>
                      <input
                        name="filter"
                        type="text"
                        placeholder="Buscar"
                        value={state.filter}
                        onChange={this.onChange}
                      />
                    </div>
                  }
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
                      <div className="large">{item.name}</div>
                      <div className="large">{item.brand}</div>
                      <div className="large hiddable">{item.site}</div>
                      <div className="large hiddable">{item.status}</div>
                    </div>
                  )}
                  title="Registros"
                  elements={
                    state.filter
                      ? props.inventoryReports.filter(
                          $0 =>
                            JSON.stringify($0)
                              .toLowerCase()
                              .search(new RegExp(state.filter.toLowerCase())) >= 0
                        )
                      : props.inventoryReports
                  }
                  titles={[
                    { title: 'Nombre', className: 'medium' },
                    { title: 'Marca', className: '' },
                    { title: 'Sitio', className: 'hiddable' },
                    { title: 'Estatus', className: 'medium hiddable' }
                  ]}
                />
              </div>
            </div>
          </div>
        )}
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
        setFacialReport(timestamp, event, success, risk, zone, status, site, access, pin, photo, id)
      )
    },
    setInventoryReport: report => {
      dispatch(setInventoryReport(report))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Inventory)
