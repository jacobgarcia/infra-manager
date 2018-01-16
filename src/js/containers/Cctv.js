import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import { } from '../actions'
import { Table, DateRangePicker, RiskBar } from '../components'

class Cctv extends Component {
  constructor(props) {
    super(props)

    this.state = {
      logs: this.props.cameraReports,
      alerts: [],
      selectedElementIndex: [null,null]
    }
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
                <p className="button action">Enero 3 - Hoy</p>
                <p className="button action">Filtrar</p>
              </div>
            }
            selectedElementIndex={state.selectedElementIndex}
            element={(item, index, sectionIndex) =>
              <div className={`table-item ${state.selectedElementIndex[0] === index && state.selectedElementIndex[1] === sectionIndex ? 'selected' : ''}`}
                key={index}
                onClick={() => this.onLogSelect(item, index, sectionIndex)}>
                <div className="medium">{this.state.logs[index].day} <span>{this.state.logs[index].hour}</span></div>
                <div className="large">{this.state.logs[index].event}</div>
                <div>{this.state.logs[index].zone}</div>
                <div>{this.state.logs[index].site}</div>
                <div><RiskBar risk={this.state.logs[index].risk} /></div>
                <div className="medium">{this.state.logs[index].status}</div>
              </div>
            }
            elements={[
              { title: 'Registros', elements: state.logs},
              { title: 'Alertas', elements: state.alerts}
            ]}
            titles={[
              {title: 'Tiempo', className: 'medium'},
              {title: 'Suceso', className: 'large'},
              {title: 'Zona'},
              {title: 'Sitio'},
              {title: 'Riesgo'},
              {title: 'Estatus o acción', className: 'medium'}
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
  cameraReports: PropTypes.func
}

function mapStateToProps({cameraReports}) {
  return {
    cameraReports
  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cctv)
