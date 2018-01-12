import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'
import DayPicker from 'react-day-picker'
import Slider from 'react-slick'

import { } from '../actions'
import { Table, RiskBar } from '../components'

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
                <div>Norte</div>
                <div>50</div>
                <div><RiskBar risk={index % 4 + 1}/></div>
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
              {title: 'Zona'},
              {title: 'Sitio'},
              {title: 'Riesgo'},
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
              <Slider nextArrow={<button>{'>'}</button>}  prevArrow={<button>{'<'}</button>}>
                <div className="image-slider" style={{backgroundImage: `url(https://i.ytimg.com/vi/PJ5xXXcfuTc/maxresdefault.jpg)`}} />
                <div className="image-slider" style={{backgroundImage: `url(https://ak7.picdn.net/shutterstock/videos/27691087/thumb/1.jpg)`}} />
                <div className="image-slider" style={{backgroundImage: `url(https://www.gannett-cdn.com/-mm-/31a9e27e0f932508d2f38a8878fb2df3cab6c7c9/c=0-0-699-524&r=x404&c=534x401/local/-/media/2015/06/24/DesMoines/B9317848452Z.1_20150624231249_000_GUAB62DVM.1-0.jpg)`}}/>
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
                  <div className="plate" style={{backgroundImage: `url(https://2.bp.blogspot.com/-EJPdoW3MKUg/WF4GwT3hQLI/AAAAAAAAlZY/tGk4NCebqzwTf2ySUOj2jbALJ2wUBVkVwCLcB/s1600/Placa%2BNAA-99-99%2BEstado%2Bde%2BM%25C3%25A9xico%2BNueva%2Bserie.jpg)`}}></div>
                  <p>NAA-77-41</p>
                </div>
                <div className="detail">
                  <span>Placa trasera</span>
                  <div className="plate" style={{backgroundImage: `url(https://2.bp.blogspot.com/-EJPdoW3MKUg/WF4GwT3hQLI/AAAAAAAAlZY/tGk4NCebqzwTf2ySUOj2jbALJ2wUBVkVwCLcB/s1600/Placa%2BNAA-99-99%2BEstado%2Bde%2BM%25C3%25A9xico%2BNueva%2Bserie.jpg)`}}></div>
                  <p>NAA-77-41</p>
                </div>
                <div className="detail">
                  <span>Personas visibles</span>
                  <p>3</p>
                </div>
                <div className="detail">
                  <span>Conductor autorizado</span>
                  <div className="profile-photo" style={{backgroundImage: `url(https://cap.stanford.edu/profiles/viewImage?profileId=19141&type=square&ts=1509532892453)`}}></div>
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
