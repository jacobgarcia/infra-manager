import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { DateUtils } from 'react-day-picker'

import { } from '../actions'
import { Table, DateRangePicker, RiskBar, VideoPlayer } from '../components'

class VideoSurveillance extends Component {
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
    const videoJsOptions = {
      controls: true,
      autoplay: true,
      sources: [{
        src: 'rtmp://demo.connus.mx/live&stream',
        type: 'rtmp/mp4'
      }],
      width: 360,
      height: 240,
      controlBar: {
          volumePanel: false
      }
    }
    return (
      <div className="app-content facial-recognition small-padding">
        <Helmet>
          <title>Connus | Video Vigilancia</title>
        </Helmet>
        <div className="content">
          <h2>Video Vigilancia</h2>
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
              { title: 'CAMARAS', elements: props.cameraReports},
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
                  <VideoPlayer { ...state.selectedLog.videoJsOptions } />
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

VideoSurveillance.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(VideoSurveillance)
