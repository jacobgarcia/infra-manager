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
      to: new Date()
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

    return (
      <div className="app-content facial-recognition small-padding">
        <Helmet>
          <title>Connus | Reconocimiento Facial</title>
        </Helmet>
        <div className="content">
          <h2>Reconocimiento Facial</h2>
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
          { this.state.logs[this.state.selectedElementIndex[0]] ?
            <div className={`log-detail-container ${state.showLogDetail ? '' : 'hidden'}`}>
            <div className="content">
              <span onClick={() => this.setState({ showLogDetail: false, selectedElementIndex: [null,null] })} className="close">Cerrar</span>
              <div className="time-location">
                <p>{this.state.logs[this.state.selectedElementIndex[0]].day} {this.state.logs[this.state.selectedElementIndex[0]].hour}</p>
                <p>Zona <span>{this.state.logs[this.state.selectedElementIndex[0]].zone}</span> Sitio <span>{this.state.logs[this.state.selectedElementIndex[0]].site}</span></p>
              </div>
              <div className="detail">
                <span>Rostro detectado</span>
                <div className="image-slider" style={{backgroundImage: `url(/static/img/dummy/frm-0` + this.state.selectedElementIndex[0] +`.jpg)`}} />
              </div>
              <div className="details-container">
                <div className="detail">
                  <span>Hora del suceso</span>
                  <p>{this.state.logs[this.state.selectedElementIndex[0]].hour}</p>
                </div>
                <div className="detail">
                  <span>Tipo de ingreso</span>
                  <p>{this.state.logs[this.state.selectedElementIndex[0]].access}</p>
                </div>
                <div className="detail">
                  <span>Usuario Autorizado</span>
                  <p>{this.state.logs[this.state.selectedElementIndex[0]].authorized}</p>
                </div>
                <div className="detail">
                  <span>Coincide con registro</span>
                  <p>{this.state.logs[this.state.selectedElementIndex[0]].match}</p>
                </div>
                <div className="detail">
                  <span>Estatus</span>
                  <p>{this.state.logs[this.state.selectedElementIndex[0]].status}</p>
                </div>
                <div className="detail">
                  <span>Código único de identificación</span>
                  <p>{this.state.logs[this.state.selectedElementIndex[0]].id}</p>
                  <img src="" alt=""/>
                </div>
              </div>
              <div className="action destructive">
                <p>Contactar seguridad</p>
              </div>
            </div>
            </div>
            : <div></div>
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
