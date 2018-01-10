import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'
import DayPicker from 'react-day-picker'
import Slider from 'react-slick'

import { } from '../actions'
import { Table } from '../components'

class VehicularFlow extends Component {
  constructor(props) {
    super(props)

    this.state = {
      logs: [0,0,0,0,0,0,0,0,0],
      alerts: [0,0,0,0,0],
      selectedLog: null,
      showLogDetail: false,
      selectedElementIndex: [null,null]
    }

    this.onLogSelect = this.onLogSelect.bind(this)
  }

  onLogSelect(element, elementIndex, sectionIndex) {
    this.setState({
      selectedLog: element,
      showLogDetail: true,
      selectedElementIndex: [elementIndex, sectionIndex]
    })
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
            actionsContainer={
              <div>
                <p className="button action">Enero 3 - Hoy</p>
                <p className="button action">Filtrar</p>
              </div>
            }
            selectedElementIndex={state.selectedElementIndex}
            element={(item, index, sectionIndex) =>
              <div className={`table-item ${state.selectedElementIndex[0] === index && state.selectedElementIndex[1] === sectionIndex ? 'selected' : ''}`}
                key={index}
                onClick={() => this.onLogSelect(item, index, sectionIndex)}>
                <div className="medium">3 enero <span>7:45 AM</span></div>
                <div className="medium">Camioneta</div>
                <div>50</div>
                <div>1 Norte</div>
                <div className="medium">Andrés López</div>
                <div>Proveedor</div>
              </div>
            }
            elements={[
              { title: 'Registros', elements: state.logs},
              { title: 'Alertas', elements: state.alerts}
            ]}
            titles={[
              {title: 'Tiempo', className: 'medium'},
              {title: 'Tipo de vehículo', className: 'medium'},
              {title: 'Sitio'},
              {title: 'Acceso'},
              {title: 'Persona autorizada', className: 'medium'},
              {title: 'Tipo de acceso'}
            ]}
          />
          <div className={`log-detail-container ${state.showLogDetail ? '' : 'hidden'}`}>
            <div className="content">
              <span onClick={() => this.setState({ showLogDetail: false, selectedElementIndex: [null,null] })} className="close">Cerrar</span>
              <div className="time-location">
                <p>3 Enero 07:45 PM</p>
                <p>Zona <span>Norte</span> Sitio <span>5</span></p>
              </div>
              <Slider>
                <div className="image-slider 2">
                  <img src="https://i.ytimg.com/vi/PJ5xXXcfuTc/maxresdefault.jpg" alt=""/>
                </div>
                <div className="image-slider 3">
                  <img src="https://ak7.picdn.net/shutterstock/videos/27691087/thumb/1.jpg" alt=""/>
                </div>
                <div className="image-slider 4">
                  <img src="https://www.gannett-cdn.com/-mm-/31a9e27e0f932508d2f38a8878fb2df3cab6c7c9/c=0-0-699-524&r=x404&c=534x401/local/-/media/2015/06/24/DesMoines/B9317848452Z.1_20150624231249_000_GUAB62DVM.1-0.jpg" alt=""/>
                </div>
                {/* <div className="image-slider 5"></div> */}
              </Slider>
              <div className="action">
                <p>Acceso denegado</p>
              </div>
              <div className="details-container">
                <div className="detail">
                  <span>Marca</span>
                  <p>Kia</p>
                </div>
                <div className="detail">
                  <span>Marca</span>
                  <p>Kia</p>
                </div>
                <div className="detail">
                  <span>Marca</span>
                  <p>Kia</p>
                </div>
                <div className="detail">
                  <span>Placa delantera</span>
                  <img src="" alt=""/>
                  <p>MPK-36-36</p>
                </div>
                <div className="detail">
                  <span>Placa trasera</span>
                  <img src="" alt=""/>
                  <p>MPK-36-36</p>
                </div>
                <div className="detail">
                  <span>Personas visibles</span>
                  <p>3</p>
                </div>
                <div className="detail">
                  <span>Conductor autorizado</span>
                  <img src="" alt="" className="profile-picture"/>
                  <p>Omar García</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

VehicularFlow.propTypes = {

}

function mapStateToProps({}) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VehicularFlow)
