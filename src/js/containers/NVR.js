import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { DateUtils } from 'react-day-picker'
import ReactPlayer from 'react-player'
import * as WebView from 'react-electron-web-view';
import {} from '../actions'
import { Table, RiskBar } from '../components'

import { NetworkOperation } from '../lib'

class VideoSurveillance extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedLog:
        this.props.cameraReports.length > 0
          ? this.props.cameraReports[0]
          : null,
      selectedElementIndex:
        this.props.cameraReports.length > 0 ? [0, 0] : [null, null],
      from: new Date(),
      showLogDetail: true,
      to: new Date(),
      playingVideo: true,
      isPlaying: false,
      iframe : { __html : '<iframe src="http://192.168.0.102" width="540" height="450"></iframe>' }
    }

    this.onDayClick = this.onDayClick.bind(this)
    this.onLogSelect = this.onLogSelect.bind(this)
    this.onVideoDemand = this.onVideoDemand.bind(this)
  }

  onLogSelect(item, index, sectionIndex) {
    console.log('https://stream.connus.mx/hls/' + this.state.room + '.m3u8')
    this.setState(
      {
        showLogDetail: true,
        selectedLog: item,
        selectedElementIndex: [index, sectionIndex],
        playingVideo: false,
        index
      },
      () => {
        this.setState({
          playingVideo: true,
          selectedElementIndex: [index, sectionIndex]
        })
      }
    )

    this.forceUpdate()
  }

  onVideoDemand() {
    const { state } = this
    NetworkOperation.createVideoToken(
      state.selectedLog.site.key,
      state.selectedLog.id
    ).then(({ data }) => {
      this.setState({
        isLoading: true,
        isPlaying: true,
      })
      setInterval(
        () => this.setState({ room: data.room, isLoading: false }),
        20000
      )
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
    return (
      <div className="app-content small-padding">
        <Helmet>
          <title>Connus | Video Vigilancia</title>
        </Helmet>
        <div className="content vertical">
          <h2>Video Vigilancia</h2>
          <div dangerouslySetInnerHTML = {state.iframe} />
        </div>
      </div>
    )
  }
}

VideoSurveillance.propTypes = {
  cameraReports: PropTypes.array
}


function mapStateToProps({ cameraReports }) {
  return {
    cameraReports
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoSurveillance)
