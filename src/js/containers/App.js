import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import io from 'socket.io-client'

import { setCredentials, setComplete, setLoading, setExhaustive, setReport, setFacialReport } from '../actions'
import { Dashboard, Users, Statistics, Settings, Map, Accesses, VehicularFlow, Perimeter, FacialRecognition, VideoSurveillance, Reports, Sensors } from './'
import { Navigator, VideoPlayer } from '../components'
import { NetworkOperation, NetworkOperationFRM } from '../lib'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: false,
      isLoading: true,
      willCompleteLoad: false,
      alerts: []
    }

    this.cleanupAlerts = this.cleanupAlerts.bind(this)
    this.addManualAlert = this.addManualAlert.bind(this)
  }

  cleanupAlerts() {
    this.setState(prev => ({
      alerts: prev.alerts.filter(({timestamp}) => timestamp + 7000 > Date.now())
    }))
  }

  componentWillUnmount() {
    clearInterval(this.cleanupAlerts)
  }

  componentDidMount() {
    const token = localStorage.getItem('token')
    let path = ''
    if (this.props.location.pathname !== '/') {
      path = `?return=${this.props.location.pathname}${this.props.location.search}`
    }

    setInterval(this.cleanupAlerts, 5000)

    if (!token) {
      localStorage.removeItem('token')
      this.props.history.replace(`/login${path}`)
    }

    this.props.setLoading()

    // Set FRM access store
    NetworkOperationFRM.getAccess()
    .then(({data}) => {
      data.accessLogs.forEach(report => {
        if (this.props.credentials.company.name === 'Connus' && report.site === 'CNHQ9094') this.props.setFacialReport(report.timestamp, report.event, report.success, report.risk, report.zone, report.status, report.site, report.access, report.pin, report.photo, report._id)
        else if (this.props.credentials.company.name === 'AT&T' && report.site !== 'CNHQ9094') this.props.setFacialReport(report.timestamp, report.event, report.success, report.risk, report.zone, report.status, report.site, report.access, report.pin, report.photo, report._id)
      })
    })

    NetworkOperation.getSelf()
    .then(({data}) => {
      this.setState({
        willCompleteLoad: true
      })
      setTimeout(() => {
        this.setState({
          isLoading: false
        })
      }, 300)
      this.props.setCredentials({...data.user, token})

      // Start socket connection
      this.initSockets()

      return NetworkOperation.getExhaustive()
    })
    .then(({data}) => {
      // Set all zones
      this.props.setExhaustive(data.zones)
    })
    .catch(error => {
      const { response = {} } = error

      if (response.status === 401 || response.status === 400 || response.status === 404) {
        this.props.history.replace(`/login${path}`)
      }
    })
    .then(this.props.setComplete())
  }

  initSockets() {
    this.socket = io('https://connus.be')

    this.socket.on('connect', () => {
      this.socket.emit('join', 'connus')
    })

    this.socket.on('alert', alert => {
      this.setState(prev => ({
        alerts: prev.alerts.concat([{...alert, timestamp: Date.now()}])
      }))
    })
  }

  // Add manual alert
  addManualAlert() {
    const alert = {}
    this.setState(prev => ({
      alerts: prev.alerts.concat([{...alert, timestamp: Date.now()}])
    }))
  }

  componentDidCatch(error, info) {
    console.warn('ERROR')
    console.error(error, info)

    this.setState({
      error: true
    })
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-screen">
          <h1>Error en la aplicación</h1>
          <p onClick={() => window.location.reload()} className="message">Favor de recargar la página</p>
          <p className="legend">Si el problema persiste, favor de reportarlo a <a href="mailto:soporte@connus.mx">soporte@connus.mx</a></p>
        </div>
      )
    }

    const videoJsOptions = {
      controls: true,
      autoplay: true,
      sources: [{
        src: 'rtmp://91.230.211.87:1935/720p&hd',
        type: 'rtmp/mp4'
      }],
      preload: 'auto',
      techorder: ["flash"]
    }

    return (
      <div id="app">
        {
          this.state.isLoading
          &&
          <div className={`loading-screen ${this.state.willCompleteLoad ? 'dismissed' : ''}`}>
            <h1>Cargando...</h1>
          </div>
        }
        <Helmet>
          <title>Connus</title>
        </Helmet>
        <div className="alerts__container">
          {
            this.state.alerts.map(alert =>
              <div key={alert.timestamp} className={`alert ${alert.timestamp + 5000 < Date.now() ? 'invalid' : ''}`}>
                <div className="alert__image">
                </div>
                <div className="alert__body">
                  <p>{alert.site}</p>
                  <p>{alert.alert}</p>
                </div>
              </div>
            )
          }
        </div>
        <Navigator credentials={this.props.credentials} />
        <Switch>
          {/* MAYBE TODO lazy load this component  */}
          <Route exact path="/" component={Dashboard}/>
          {/* TODO lazy load this component  */}
          <Route path="/sites/:zoneId?/:siteId?" component={Map} />
          <Route path="/users" component={Users}/>
          <Route path="/accesses" component={Accesses}/>
          <Route path="/vehicular-flow" component={VehicularFlow}/>
          <Route path="/perimeter" component={Perimeter}/>
          <Route path="/facial-recognition" component={FacialRecognition}/>
          <Route path="/statistics" component={Statistics}/>
          <Route path="/video-surveillance" component={VideoSurveillance}/>
          <Route path="/reports" component={Reports}/>
          <Route path="/settings" component={Settings}/>
          <Route path="/sensors" component={Sensors}/>
          <Route path="/streaming" render={() => <VideoPlayer { ...videoJsOptions } />} />
        </Switch>
      </div>
    )
  }
}

App.propTypes = {
  setCredentials: PropTypes.func,
  history: PropTypes.object,
  user: PropTypes.object,
  credentials: PropTypes.object,
  location: PropTypes.object,
  setLoading: PropTypes.func,
  setExhaustive: PropTypes.func,
  setComplete: PropTypes.func,
  setFacialReport: PropTypes.func
}

function mapDispatchToProps(dispatch) {
  return {
    setReport: report => {
      dispatch(setReport(report))
    },
    setCredentials: user => {
      dispatch(setCredentials(user))
    },
    setLoading: () => {
      dispatch(setLoading())
    },
    setComplete: () => {
      dispatch(setComplete())
    },
    setExhaustive: zones => {
      dispatch(setExhaustive(zones))
    },
    setFacialReport: (timestamp, event, success, risk, zone, status, site, access, pin, photo, id) => {
      dispatch(setFacialReport(timestamp, event, success, risk, zone, status, site, access, pin, photo, id))
    }
  }
}

function mapStateToProps({loading, credentials}) {
  return {
    loading,
    credentials
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
