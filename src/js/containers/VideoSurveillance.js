import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { DateUtils } from 'react-day-picker'
import ReactPlayer from 'react-player'


import { } from '../actions'
import { Table, DateRangePicker, RiskBar, VideoPlayer } from '../components'

import { NetworkOperation } from '../lib'

class VideoSurveillance extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedLog: this.props.cameraReports.length > 0 ? this.props.cameraReports[0] : null,
      selectedElementIndex: this.props.cameraReports.length > 0 ? [0,0] : [null,null],
      from: new Date(),
      showLogDetail: true,
      to: new Date(),
      playingVideo: true
    }

    this.onDayClick = this.onDayClick.bind(this)
    this.onLogSelect = this.onLogSelect.bind(this)
    this.onVideoDemand = this.onVideoDemand.bind(this)
  }

  onLogSelect(item, index, sectionIndex) {
    console.log('https://stream.connus.mx/hls/' + this.state.room + '.m3u8')
    this.setState({
      showLogDetail: true,
      selectedLog: item,
      selectedElementIndex: [index, sectionIndex],
      playingVideo: false
    }, () => {
      this.setState({
        playingVideo: true
      })
    })

    this.forceUpdate()
  }

  onVideoDemand() {
    const { state } = this
    NetworkOperation.createVideoToken(state.selectedLog.site.key, state.selectedLog.id)
    .then(({data}) => {
      setInterval(() => this.setState({ room: data.room }), 10000)

    })
  }

  onDayClick(day) {
    // TODO Network operation for selected period
    const range = DateUtils.addDayToRange(day, this.state)
    this.setState(range)
  }

  componentDidCatch(error, info) {
    console.warn('Component had error', error)
  }

  render() {
    const { state, props } = this

    const videoJsOptions = {
      controls: true,
      autoplay: false,
      sources: [{
        src: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
        type: 'application/x-mpegURL'
      }],
      poster: state.selectedLog.photo,
      width: 340,
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
          <div className="tables-detail__container">
            <div className={`log-detail-container ${state.showLogDetail ? '' : 'hidden'}`}>
              <div className="content">
                {/* <span onClick={() => this.setState({ showLogDetail: false, selectedElementIndex: [null,null] })} className="close">Cerrar</span> */}
                <div className="time-location">
                  <p>{state.selectedLog.name && state.selectedLog.name}</p>
                  <p>Zona <span>{state.selectedLog.name && state.selectedLog.zone.name}</span> Sitio <span>{state.selectedLog.site.key}</span></p>
                </div>

                <div>
                    {
                      <ReactPlayer url={'https://stream.connus.mx/hls/' + state.room + '.m3u8'} playing width="340" height="240" controls/>
                    }
                </div>
                <div className="action destructive">
                  <p onClick={this.onVideoDemand}>Pedir Video</p>
                </div>
              </div>
          </div>
            <div className="tables-container">
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
                    <div className="large">{item.name}</div>
                    <div className="hiddable">{item.zone.name}</div>
                    <div className="hiddable">{item.site && item.site.key}</div>
                    <div className="medium hiddable">{item.id}</div>
                  </div>
                }
                elements={props.cameraReports}
                titles={[
                  {title: 'Nombre', className: 'large'},
                  {title: 'Zona', className: 'hiddable'},
                  {title: 'Sitio', className: 'hiddable'},
                  {title: 'Identificador', className: 'medium hiddable'}
                ]}
              />
            </div>
          </div>
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
