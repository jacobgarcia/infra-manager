import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { DateUtils } from 'react-day-picker'

import { } from '../actions'
import { Table, DateRangePicker } from '../components'

class Cctv extends Component {
  constructor(props) {
    super(props)

    this.state = {
      logs: [0,0,0,0,0,0],
      alerts: [],
      selectedElementIndex: [null,null],
      from: new Date(),
      to: new Date()
    }

    this.onDayClick = this.onDayClick.bind(this)
  }

  onDayClick(day) {
    // TODO Network operation for selected period
    const range = DateUtils.addDayToRange(day, this.state)
    this.setState(range)
  }

  render() {
    const { state, props } = this

    return (
      <div className="app-content cctv small-padding">
        <Helmet>
          <title>Connus | CCTV</title>
        </Helmet>
        <div className="content">
          <h2>CCTV</h2>
          <Table
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
        </div>
        <div className={`log-detail-container ${state.showLogDetail ? '' : 'hidden'}`}>
          <div className="content">
            <span onClick={() => this.setState({ showLogDetail: false, selectedElementIndex: [null,null] })} className="close">Cerrar</span>
            <div className="time-location">
              <p>3 Enero 07:45 PM</p>
              <p>Zona <span>Norte</span> Sitio <span>5</span></p>
            </div>
            <div className="image-slider">

            </div>
            <div className="detail">
              <span>Galería</span>
              <div className="image-slider">

              </div>
            </div>
            <div className="action destructive">
              <p>Contactar seguridad</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Cctv.propTypes = {

}

function mapStateToProps({}) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cctv)
