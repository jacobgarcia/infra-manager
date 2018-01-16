import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import { Table, RiskBar } from '../components'
import { } from '../actions'

class Perimeter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      logs: this.props.perimeterReports,
      alerts: [],
      selectedElementIndex: [null, null],
      showLogDetail: false
    }

    this.onLogSelect = this.onLogSelect.bind(this)
  }

  onLogSelect(item) {
    this.setState({
      showLogDetail: true,
      selectedLog: item
    })
  }

  render() {
    const { state, props } = this

    return (
      <div className="app-content perimeter small-padding">
        <Helmet>
          <title>Connus | Perímetro</title>
        </Helmet>
        <div className="content">
          <h2>Perímetro</h2>
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

Perimeter.propTypes = {
  perimeterReports: PropTypes.func
}

function mapStateToProps({perimeterReports}) {
  return {
    perimeterReports
  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Perimeter)
