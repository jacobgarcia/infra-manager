import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { DateUtils } from 'react-day-picker'
import {} from 'actions'

import { NetworkOperation } from 'lib'

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
      iframe: {
        __html:
          '<iframe src="https://www.cracking.com.ar/redir/redir.php?URL=http://82.223.16.78/vc_dashboard_connus/cms.php" width="540" height="450"></iframe>'
      }
    }

    this.onDayClick = this.onDayClick.bind(this)
    this.onLogSelect = this.onLogSelect.bind(this)
    this.onVideoDemand = this.onVideoDemand.bind(this)
  }

  onLogSelect(item, index, sectionIndex) {
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
        isPlaying: true
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

  componentDidCatch(error) {
    console.warn('Component had error', error)
  }

  render() {
    const { state } = this
    return (
      <div className="app-content small-padding">
        <Helmet>
          <title>Connus | Visual Counter</title>
        </Helmet>
        <div className="content vertical">
          <h2>Visual Counter Dashboard</h2>
          <div dangerouslySetInnerHTML={state.iframe} />
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

function mapDispatchToProps() {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoSurveillance)
