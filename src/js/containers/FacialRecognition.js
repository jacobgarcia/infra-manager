import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { DateUtils } from 'react-day-picker'

import { Table, RiskBar, DateRangePicker } from '../components'
import { } from '../actions'

import { NetworkOperation } from '../lib'
import io from 'socket.io-client'

class FacialRecognition extends Component {
  constructor(props) {
    super(props)

    this.state = {
      logs: this.props.facialReports,
      selectedElementIndex: [null,null],
      showLogDetail: false,
      from: new Date(),
      to: new Date(),
      selectedLog: null
    }

    this.onLogSelect = this.onLogSelect.bind(this)
    this.onDayClick = this.onDayClick.bind(this)


  }

  componentDidMount(){
    console.log(this.props.facialReports)
  }

  onLogSelect(item, index, sectionIndex) {
    this.setState({
      showLogDetail: true,
      selectedLog: item,
      selectedElementIndex: [index, sectionIndex]
    })
  }

  onDayClick(day) {
    // TODO Network operation for selected period
    const range = DateUtils.addDayToRange(day, this.state)
    this.setState(range)
  }

  render() {
    const { state, props } = this
    console.log('ALERTS')
    console.log(props.facialReports.filter($0 => $0.risk >= 3))

    return (
      <div className="app-content facial-recognition small-padding">
        <Helmet>
          <title>Connus | Reconocimiento Facial</title>
        </Helmet>
        <div className="content">
          <h2>Reconocimiento Facial</h2>
          <Table
            className={`${state.showLogDetail ? 'detailed' : ''}`}
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
                <div className="medium">{item.timestamp && `${item.timestamp.toLocaleDateString('es-MX')} ${item.timestamp.toLocaleTimeString()}`}</div>
                <div className="large">{item.event}</div>
                <div className="hiddable">{item.zone}</div>
                <div className="hiddable">{item.site}</div>
                <div><RiskBar risk={item.risk} /></div>
                <div className="large hiddable">{item.status}</div>
              </div>
            }
            elements={[
              { title: 'Registros', elements: props.facialReports.filter($0 => $0.risk < 1) },
              { title: 'Alertas', elements: props.facialReports.filter($0 => $0.risk >= 1) }
            ]}
            titles={[
              {title: 'Tiempo', className: 'medium'},
              {title: 'Suceso', className: 'large'},
              {title: 'Zona', className: 'hiddable'},
              {title: 'Sitio', className: 'hiddable'},
              {title: 'Riesgo'},
              {title: 'Estatus o acción', className: 'large hiddable'}
            ]}
          />
          { state.selectedLog !== null
            &&
            <div className={`log-detail-container ${state.showLogDetail ? '' : 'hidden'}`}>
              <div className="content">
                <span onClick={() => this.setState({ showLogDetail: false, selectedElementIndex: [null,null] })} className="close">Cerrar</span>
                <div className="time-location">
                  <p>{state.selectedLog.timestamp && `${state.selectedLog.timestamp.toLocaleDateString('es-MX')} ${state.selectedLog.timestamp.toLocaleTimeString()}`}</p>
                  <p>Zona <span>{state.selectedLog.zone.name}</span> Sitio <span>{state.selectedLog.site}</span></p>
                </div>
                <div className="detail">
                  <span>Rostro detectado</span>
                  <div className="image-slider" style={{backgroundImage: `url(` + state.selectedLog.photo +`)`}} />
                </div>
                <div className="details-container">
                  <div className="detail">
                    <span>Hora del suceso</span>
                    <p>{state.selectedLog.timestamp.toLocaleTimeString()}</p>
                  </div>
                  <div className="detail">
                    <span>Tipo de ingreso</span>
                    <p>{state.selectedLog.access}</p>
                  </div>
                  <div className="detail">
                    <span>Usuario Autorizado</span>
                    <p>{state.selectedLog.authorized}</p>
                  </div>
                  <div className="detail">
                    <span>Coincide con registro</span>
                    <p>{state.selectedLog.match}</p>
                  </div>
                  <div className="detail">
                    <span>Estatus</span>
                    <p>{state.selectedLog.status}</p>
                  </div>
                  <div className="detail">
                    <span>Código único de identificación</span>
                    <p>{state.selectedLog.id}</p>
                    <img src="" alt=""/>
                  </div>
                </div>
                <div className="action destructive">
                  <p>Contactar seguridad</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}

FacialRecognition.propTypes = {
  setLog: PropTypes.func,
  facialReports: PropTypes.array
}

function mapStateToProps({ zones, facialReports}) {
  return {
    zones,
    facialReports
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setLog: report => {
      dispatch(setLog(report))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FacialRecognition)
