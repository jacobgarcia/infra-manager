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

    this.state = {
      logs: this.props.vehicularReports,
      alerts: [0,0,0,0,0],
      selectedLog: null,
      showLogDetail: false,
      selectedElementIndex: [null,null],
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
          <h2>Flujo Vehicular</h2>
          <Table
            className={state.showLogDetail ? 'detailed' : ''}
            actionsContainer={
              <div>
                <DateRangePicker
                  from={state.from}
                  to={state.to}
                  onDayClick={this.onDayClick}
                />
                <p className="button action disabled">Filtrar</p>
              </div>
            }
            selectedElementIndex={state.selectedElementIndex}
            element={(item, index, sectionIndex) =>
              <div
                className={`table-item ${state.selectedElementIndex[0] === index && state.selectedElementIndex[1] === sectionIndex ? 'selected' : ''}`}
                key={index}
                onClick={() => this.onLogSelect(item, index, sectionIndex)}>
                <div className="medium">{this.state.logs[index].day} <span>{this.state.logs[index].hour}</span></div>
                <div className="medium">{this.state.logs[index].vehicle}</div>
                <div>{this.state.logs[index].zone}</div>
                <div>{this.state.logs[index].site}</div>
                <div>{this.state.logs[index].authorized}</div>
                <div>{this.state.logs[index].access}</div>
              </div>
            }
            elements={[
              { title: 'Registros', elements: state.logs},
              { title: 'Alertas', elements: state.alerts}
            ]}
            titles={[
              {title: 'Tiempo', className: 'medium'},
              {title: 'Tipo de vehículo', className: 'medium'},
              {title: 'Zona'},
              {title: 'Sitio'},
              {title: 'Persona Autorizada'},
              {title: 'Tipo de acceso'}
            ]}
          />
          <div className={`log-detail-container ${state.showLogDetail ? '' : 'hidden'}`}>
            {
              state.selectedLog &&
              <div className="content">
                <span onClick={() => this.setState({ showLogDetail: false, selectedElementIndex: [null,null] })} className="close">Cerrar</span>
                <div className="time-location">
                  <p>3 Enero 07:45 PM</p>
                  <p>Zona <span>{state.selectedLog.zone}</span> Sitio <span>{state.selectedLog.site}</span></p>
                </div>
                <Slider nextArrow={<button>{'>'}</button>} prevArrow={<button>{'<'}</button>}>
                  <div className="image-slider" style={{backgroundImage: `url(https://i.ytimg.com/vi/PJ5xXXcfuTc/maxresdefault.jpg)`}} />
                  <div className="image-slider" style={{backgroundImage: `url(https://ak7.picdn.net/shutterstock/videos/27691087/thumb/1.jpg)`}} />
                  <div className="image-slider" style={{backgroundImage: `url(https://www.gannett-cdn.com/-mm-/31a9e27e0f932508d2f38a8878fb2df3cab6c7c9/c=0-0-699-524&r=x404&c=534x401/local/-/media/2015/06/24/DesMoines/B9317848452Z.1_20150624231249_000_GUAB62DVM.1-0.jpg)`}}/>
                  {/* <div className="image-slider 5"></div> */}
                </Slider>
                <div className="car-details">
                  <div className="plate" style={{backgroundImage: `url(https://2.bp.blogspot.com/-EJPdoW3MKUg/WF4GwT3hQLI/AAAAAAAAlZY/tGk4NCebqzwTf2ySUOj2jbALJ2wUBVkVwCLcB/s1600/Placa%2BNAA-99-99%2BEstado%2Bde%2BM%25C3%25A9xico%2BNueva%2Bserie.jpg)`}}></div>
                  <div className="plate" style={{backgroundImage: `url(https://2.bp.blogspot.com/-EJPdoW3MKUg/WF4GwT3hQLI/AAAAAAAAlZY/tGk4NCebqzwTf2ySUOj2jbALJ2wUBVkVwCLcB/s1600/Placa%2BNAA-99-99%2BEstado%2Bde%2BM%25C3%25A9xico%2BNueva%2Bserie.jpg)`}}></div>
                  <div className="detail">
                    <div className="profile-photo" style={{backgroundImage: `url(https://cap.stanford.edu/profiles/viewImage?profileId=19141&type=square&ts=1509532892453)`}}></div>
                    <p>Omar García</p>
                  </div>
                </div>
                <div className="action">
                  <p className="warning">Acceso denegado</p>
                </div>
                <div className="details-container">
                  <div className="detail">
                    <span>Tipo</span>
                    <p>{state.selectedLog.vehicle}</p>
                  </div>
                  <div className="detail">
                    <span>Marca</span>
                    <p>Kia</p>
                  </div>
                  <div className="detail">
                    <span>Modelio</span>
                    <p>Rio</p>
                  </div>
                  <div className="detail">
                    <span>Color</span>
                    <p>Azul</p>
                  </div>
                  <div className="detail">
                    <span>Placa delantera</span>
                    <p>P 287 GKK</p>
                  </div>
                  <div className="detail">
                    <span>Placa trasera</span>
                    <p>P 287 GKK</p>
                  </div>
                  <div className="detail">
                    <span>Conductor autorizado</span>
                    <p>{state.selectedLog.authorized}</p>
                  </div>
                </div>
              </div>
            }
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
