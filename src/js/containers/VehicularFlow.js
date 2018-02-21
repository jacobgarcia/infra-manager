import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'
import { DateUtils } from 'react-day-picker'
import Slider from 'react-slick'

import { } from '../actions'
import { Table, RiskBar, DateRangePicker } from '../components'

class VehicularFlow extends Component {
  constructor(props) {
    super(props)

    console.log(this.props.vehicularReports)

    this.state = {
      logs: this.props.vehicularReports,
      alerts: [0,0,0,0,0],
      selectedLog: this.props.vehicularReports.length > 0 ? this.props.vehicularReports[0] : null,
      showLogDetail: true,
      selectedElementIndex: this.props.vehicularReports.length > 0 ? [0,0] : [null,null],
      from: new Date(),
      to: new Date()
    }

    this.onDayClick = this.onDayClick.bind(this)
    this.onLogSelect = this.onLogSelect.bind(this)
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

  render() {
    const { state, props } = this

    return (
      <div className="app-content vehicular-flow small-padding">
        <Helmet>
          <title>Connus | Flujo Vehicular</title>
        </Helmet>
        <div className="content">
          <h2>
            Flujo Vehicular
            <div className="actions">
              <DateRangePicker
                from={state.from}
                to={state.to}
                onDayClick={this.onDayClick}
              />
              <p className="button action disabled">Filtrar</p>
            </div>
          </h2>
          <div className="tables-detail__container">
            <div className={`log-detail-container ${state.showLogDetail ? '' : 'hidden'}`}>
              {
                state.selectedLog &&
                <div className="content">
                  {/* <span onClick={() => this.setState({ showLogDetail: false, selectedElementIndex: [null,null] })} className="close">Cerrar</span> */}
                  <div className="time-location">
                    <p>3 Enero 07:45 PM</p>
                    <p>Zona <span>{state.selectedLog.zone}</span> Sitio <span>{state.selectedLog.site}</span></p>
                  </div>
                  <Slider nextArrow={<button>{'>'}</button>} prevArrow={<button>{'<'}</button>}>
                    <div className="image-slider" style={{backgroundImage: `url(` + state.selectedLog.photo_front +`)` }}/>
                    <div className="image-slider" style={{backgroundImage:`url(` + state.selectedLog.photo_back +`)` }} />
                    {/* <div className="image-slider 5"></div> */}
                  </Slider>
                  <div className="car-details">
                    <div className="plate" style={{backgroundImage: `url(` + state.selectedLog.plate_front +`)` }}></div>
                    <div className="plate" style={{backgroundImage: `url(` + state.selectedLog.plate_back +`)` }}></div>
                    <div className="detail">
                      <div className="profile-photo" style={{backgroundImage: `url(` + state.selectedLog.profile +`)` }}></div>
                      <p>{state.selectedLog.authorized}</p>
                    </div>
                  </div>
                  <div className="action">
                    <p className="authorized">Acceso autorizado</p>
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
                      <p>{state.selectedLog.color}</p>
                    </div>
                    <div className="detail">
                      <span>Placa delantera</span>
                      <p>{state.selectedLog.plate}</p>
                    </div>
                    <div className="detail">
                      <span>Placa trasera</span>
                      <p>{state.selectedLog.plate}</p>
                    </div>
                    <div className="detail">
                      <span>Conductor autorizado</span>
                      <p>{state.selectedLog.authorized}</p>
                    </div>
                  </div>
                </div>
              }
            </div>
            <div className="tables-container">
              <Table
                className={state.showLogDetail ? 'detailed' : ''}
                selectedElementIndex={state.selectedElementIndex}
                element={(item, index) =>
                  <div
                    className={`table-item ${state.selectedElementIndex[0] === index && state.selectedElementIndex[1] === 0 ? 'selected' : ''}`}
                    key={index}
                    onClick={() => this.onLogSelect(item, index, 0)}>
                    <div className="medium">{item.timestamp && `${item.timestamp.toLocaleDateString('es-MX')} ${item.timestamp.toLocaleTimeString()}`}</div>
                    <div>{item.vehicle}</div>
                    <div className="hiddable">{item.site}</div>
                    <div className="hiddable">{item.authorized}</div>
                    <div>{item.access}</div>
                  </div>
                }
                title="Registros"
                elements={props.vehicularReports.filter($0 => $0.risk === 0)}
                titles={[
                  {title: 'Tiempo', className: 'medium'},
                  {title: 'Tipo de vehículo'},
                  {title: 'Sitio', className: 'hiddable'},
                  {title: 'Persona Autorizada', className: 'hiddable'},
                  {title: 'Tipo de acceso'}
                ]}
              />
              <Table
                className={state.showLogDetail ? 'detailed' : ''}
                selectedElementIndex={state.selectedElementIndex}
                element={(item, index) =>
                  <div
                    className={`table-item ${state.selectedElementIndex[0] === index && state.selectedElementIndex[1] === 1 ? 'selected' : ''}`}
                    key={index}
                    onClick={() => this.onLogSelect(item, index, 1)}>
                    <div className="medium">{item.timestamp && `${item.timestamp.toLocaleDateString('es-MX')} ${item.timestamp.toLocaleTimeString()}`}</div>
                    <div className="large">{item.log}</div>
                    <div className="hiddable">{item.site}</div>
                    <div><RiskBar risk={item.risk} /></div>
                    <div>{item.status}</div>
                  </div>
                }
                title="Alertas"
                elements={props.vehicularReports.filter($0 => $0.risk > 0)}
                titles={[
                  {title: 'Tiempo', className: 'medium'},
                  {title: 'Suceso', className: 'large'},
                  {title: 'Sitio', className: 'hiddable'},
                  {title: 'Riesgo'},
                  {title: 'Estatus'}
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

function mapStateToProps({vehicularReports}) {
  return {
    vehicularReports
  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VehicularFlow)
