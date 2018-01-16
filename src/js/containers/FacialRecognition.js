import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { DateUtils } from 'react-day-picker'

import { Table, RiskBar, DateRangePicker } from '../components'
import { setFacialReport } from '../actions'

import { NetworkOperation } from '../lib'
import io from 'socket.io-client'


class FacialRecognition extends Component {
  constructor(props) {
    super(props)

    this.state = {
      logs: [0,0,0,0,0,0,0],
      selectedElementIndex: [null,null],
      showLogDetail: false,
      from: new Date(),
      to: new Date()
    }

    this.onLogSelect = this.onLogSelect.bind(this)
    this.onDayClick = this.onDayClick.bind(this)

    
  }

  onLogSelect(item) {
    this.setState({
      showLogDetail: true,
      selectedLog: item
    })
  }

  onDayClick(day) {
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
          <h2>Reconocimiento Facial</h2>
          <Table
            actionsContainer={
              <div>
                <DateRangePicker
                  from={state.from}
                  to={state.to}
                  onDayClick={this.onDayClick}
                />
                <p className="button action">Filtrar</p>
              </div>
            }
            selectedElementIndex={state.selectedElementIndex}
            element={(item, index, sectionIndex) =>
              <div className={`table-item ${state.selectedElementIndex[0] === index && state.selectedElementIndex[1] === sectionIndex ? 'selected' : ''}`}
                key={index}
                onClick={() => this.onLogSelect(item, index, sectionIndex)}>
                <div className="medium">3 Enero <span>7:45 AM</span></div>
                <div className="large">Placas registradas con el vehiculo no coinciden</div>
                <div>Norte</div>
                <div>{index + 10}</div>
                <div><RiskBar risk={(index % 4) + 1} /></div>
                <div className="medium">Acceso denegado</div>
              </div>
            }
            elements={[
              { title: 'Registros', elements: state.logs },
              { title: 'Alertas', elements: state.alerts }
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
          <div className={`log-detail-container ${state.showLogDetail ? '' : 'hidden'}`}>
            <div className="content">
              <span onClick={() => this.setState({ showLogDetail: false, selectedElementIndex: [null,null] })} className="close">Cerrar</span>
              <div className="time-location">
                <p>3 Enero 07:45 PM</p>
                <p>Zona <span>Norte</span> Sitio <span>5</span></p>
              </div>
              <div className="detail">
                <span>Rostro detectado</span>
                <div className="image-slider">

                </div>
              </div>
              <div className="details-container">
                <div className="detail">
                  <span>Hora del suceso</span>
                  <p>Kia</p>
                </div>
                <div className="detail">
                  <span>Tipo de ingreso</span>
                  <p>Kia</p>
                </div>
                <div className="detail">
                  <span>Método de ingreso</span>
                  <p>Kia</p>
                </div>
                <div className="detail">
                  <span>Coincide con registro</span>
                  <p>Si</p>
                </div>
                <div className="detail">
                  <span>Estatus</span>
                  <p>Continua dentro</p>
                </div>
                <div className="detail">
                  <span>Huella dactilar</span>
                  <img src="" alt=""/>
                </div>
                <div className="detail">
                  <span>Código único de identificación</span>
                  <img src="" alt=""/>
                </div>
              </div>
              <div className="action destructive">
                <p>Contactar seguridad</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

FacialRecognition.propTypes = {
  setLog: PropTypes.func,
  facialReports: PropTypes.array
}

function mapStateToProps({reports}) {
  return {
    reports
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setLog: report => {
      dispatch(setLog(report))
    },
    setFacialReport: report => {
      dispatch(setFacialReport(report))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FacialRecognition)
