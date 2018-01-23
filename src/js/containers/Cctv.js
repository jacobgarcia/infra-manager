import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { DateUtils } from 'react-day-picker'

import { } from '../actions'
import { Table, DateRangePicker, RiskBar } from '../components'

class Cctv extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedLog: null,
      selectedElementIndex: [null,null],
      from: new Date(),
      to: new Date()
    }

    this.onDayClick = this.onDayClick.bind(this)
    this.onLogSelect = this.onLogSelect.bind(this)

  }

  onLogSelect(item, index, sectionIndex) {
    this.setState({
      showLogDetail: true,
      selectedLog: item,
      selectedElementIndex: [index, sectionIndex]
    })

    this.forceUpdate()
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
          <title>Connus | CCTV</title>
        </Helmet>
        <div className="content">
          <h2>CCTV</h2>
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
                { item.timestamp ? <div className="medium">{item.timestamp.toLocaleDateString()} {item.timestamp.toLocaleTimeString()}</div> : <div />}
                <div className="large">{item.event}</div>
                <div className="hiddable">{item.zone.name}</div>
                <div className="hiddable">{item.site && item.site}</div>
                <div><RiskBar risk={item.risk} /></div>
                <div className="medium hiddable">{item.status}</div>
              </div>
            }
            elements={[
              { title: 'Registros', elements: props.cameraReports},
              { title: 'Alertas', elements: props.cameraReports.filter($0 => $0.risk > 2)}
            ]}
            titles={[
              {title: 'Tiempo', className: 'medium'},
              {title: 'Suceso', className: 'large'},
              {title: 'Zona', className: 'hiddable'},
              {title: 'Sitio', className: 'hiddable'},
              {title: 'Riesgo'},
              {title: 'Estatus o acción', className: 'medium hiddable'}
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
              <div>
                <video width="360" height="240" controls loop muted autoPlay>
                  <source src={state.selectedLog.video} type="video/mp4"/>
                </video>
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

Cctv.propTypes = {
  cameraReports: PropTypes.array
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
