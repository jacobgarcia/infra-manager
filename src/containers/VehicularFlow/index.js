import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'
import { DateUtils } from 'react-day-picker'
import Slider from 'react-slick'

import Table from 'components/Table'
import RiskBar from 'components/RiskBar'

class VehicularFlow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      logs: this.props.vehicularReports,
      alerts: [0, 0, 0, 0, 0],
      selectedLog:
        this.props.vehicularReports.length > 0
          ? this.props.vehicularReports[0]
          : null,
      showLogDetail: true,
      selectedElementIndex:
        this.props.vehicularReports.length > 0 ? [0, 0] : [null, null],
      from: new Date(),
      to: new Date()
    }

    this.onDayClick = this.onDayClick.bind(this)
    this.onLogSelect = this.onLogSelect.bind(this)
    this.colorDictionary = this.colorDictionary.bind(this)
    this.regionDictionary = this.regionDictionary.bind(this)
  }

  onLogSelect(element, elementIndex, sectionIndex) {
    this.setState({
      selectedLog: element,
      showLogDetail: true,
      selectedElementIndex: [elementIndex, sectionIndex]
    })
  }

  onDayClick(day) {
    const range = DateUtils.addDayToRange(day, this.state)
    this.setState(range)
  }

  colorDictionary(color) {
    let esColor = ''
    switch (color) {
      case 'red':
        esColor = 'Rojo'
        break
      case 'silver-gray':
        esColor = 'Gris Platinado'
        break
      default:
        esColor = 'N/A'
    }
    return esColor
  }

  regionDictionary(region) {
    let esRegion = ''
    switch (region) {
      case 'ca':
        esRegion = 'California'
        break
      default:
        esRegion = 'N/A'
    }
    return esRegion
  }

  render() {
    const { state, props } = this

    return (
      <div className="app-content vehicular-flow small-padding">
        <Helmet>
          <title>Connus | Flujo Vehicular</title>
        </Helmet>
        <div className="content">
          <h2>Flujo Vehicular</h2>
          <div className="tables-detail__container">
            <div
              className={`log-detail-container ${
                state.showLogDetail ? '' : 'hidden'
              }`}>
              {state.selectedLog && (
                <div className="content">
                  {/* <span onClick={() => this.setState({ showLogDetail: false, selectedElementIndex: [null,null] })} className="close">Cerrar</span> */}
                  <div className="time-location">
                    <p>
                      {state.selectedLog.timestamp &&
                        new Date(state.selectedLog.timestamp).toLocaleString()}
                    </p>
                    <p>
                      Zona <span>{state.selectedLog.zone}</span> Sitio{' '}
                      <span>{state.selectedLog.site}</span>
                    </p>
                  </div>
                  <Slider
                    nextArrow={<button>{'>'}</button>}
                    prevArrow={<button>{'<'}</button>}>
                    <div
                      className="image-slider"
                      style={{
                        backgroundImage: `url(` 'https://demo.connus.mx' + state.selectedLog.front + `)`
                      }}
                    />
                    <div
                      className="image-slider"
                      style={{
                        backgroundImage: `url(` 'https://demo.connus.mx'  + state.selectedLog.back + `)`
                      }}
                    />
                    {/* <div className="image-slider 5"></div> */}
                  </Slider>
                  <div className="car-details">
                    <video width="340" height="240" controls muted>
                      <source src={state.selectedLog.video} type="video/mp4" />
                    </video>
                  </div>
                  <div className="action">
                    <p className="authorized">Informacion Detallada</p>
                  </div>
                  <div className="details-container">
                    <div className="detail">
                      <span>Tipo</span>
                      <p>{state.selectedLog.vehicle}</p>
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
                      <span>Color</span>
                      <p>{this.colorDictionary(state.selectedLog.color)}</p>
                    </div>
                    <div className="detail">
                      <span>Placa delantera</span>
                      <p>{state.selectedLog.plate}</p>
                    </div>
                    <div className="detail">
                      <span>Region</span>
                      <p>{this.regionDictionary(state.selectedLog.region)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="tables-container">
              <Table
                className={state.showLogDetail ? 'detailed' : ''}
                selectedElementIndex={state.selectedElementIndex}
                element={(item, index) => (
                  <div
                    className={`table-item ${
                      state.selectedElementIndex[0] === index &&
                      state.selectedElementIndex[1] === 0
                        ? 'selected'
                        : ''
                    }`}
                    key={index}
                    onClick={() => this.onLogSelect(item, index, 0)}>
                    <div className="medium">
                      {item.timestamp &&
                        `${new Date(item.timestamp).toLocaleDateString()}`}
                    </div>
                    <div>{item.plate}</div>
                    <div className="hiddable">{item.brand}</div>
                    <div>{item.model}</div>
                    <div className="hiddable">{item.site}</div>
                  </div>
                )}
                title="Registros"
                elements={props.vehicularReports.filter($0 => $0.risk === 0)}
                titles={[
                  { title: 'Tiempo', className: 'medium' },
                  { title: 'Placas' },
                  { title: 'Marca', className: 'hiddable' },
                  { title: 'Modelo' },
                  { title: 'Sitio', className: 'hiddable' }
                ]}
              />
              <Table
                className={state.showLogDetail ? 'detailed' : ''}
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
                      {item.timestamp &&
                        `${new Date(item.timestamp).toLocaleDateString()}`}
                    </div>
                    <div className="hiddable">{item.site}</div>
                    <div>
                      <RiskBar risk={item.risk} />
                    </div>
                    <div>{item.event}</div>
                  </div>
                )}
                title="Alertas"
                elements={props.vehicularReports.filter($0 => $0.risk > 0)}
                titles={[
                  { title: 'Tiempo', className: 'medium' },
                  { title: 'Sitio', className: 'hiddable' },
                  { title: 'Riesgo' },
                  { title: 'Suceso', className: 'large' }
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

VehicularFlow.propTypes = {
  vehicularReports: PropTypes.func
}

function mapStateToProps({ vehicularReports }) {
  return {
    vehicularReports
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(VehicularFlow)
