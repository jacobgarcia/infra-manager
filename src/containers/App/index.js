import React, { Component } from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import io from 'socket.io-client'

import {
  setCredentials,
  setComplete,
  setLoading,
  setExhaustive,
  setFacialReport,
  setVehicleReport,
  setReport,
  setHistory,
  setAlarm
} from 'actions'

import Dashboard from 'containers/Dashboard'
import Users from 'containers/Users/Loadable'
import Statistics from 'containers/Statistics/Loadable'
import Settings from 'containers/Settings/Loadable'
import Map from 'containers/Map/Loadable'
import Accesses from 'containers/Accesses/Loadable'
import VehicularFlow from 'containers/VehicularFlow/Loadable'
import Perimeter from 'containers/Perimeter/Loadable'
import FacialRecognition from 'containers/FacialRecognition/Loadable'
import VideoSurveillance from 'containers/VideoSurveillance/Loadable'
import VisualCounter from 'containers/VisualCounter/Loadable'
import Reports from 'containers/Reports/Loadable'
import Sensors from 'containers/Sensors'
import Devices from 'containers/Devices/Loadable'
import Inventory from 'containers/Inventory/Loadable'
import Alarms from 'containers/Alarms'

import Navigator from 'components/Navigator'

import { NetworkOperation } from 'lib'
class App extends Component {
  state = {
    error: false,
    isLoading: true,
    willCompleteLoad: false,
    alerts: []
  }

  cleanupAlerts = () => {
    this.setState(prev => ({
      alerts: prev.alerts.filter(
        ({ timestamp }) => timestamp + 7000 > Date.now()
      )
    }))
  }

  componentWillUnmount() {
    clearInterval(this.cleanupAlerts)
  }

  componentDidMount() {
    const token = localStorage.getItem('token')
    let returnPath = ''

    if (this.props.location.pathname !== '/') {
      returnPath = `?return=${this.props.location.pathname}${
        this.props.location.search
      }`
    }

    setInterval(this.cleanupAlerts, 500000)

    if (!token) {
      localStorage.removeItem('token')
      this.props.history.replace(`/login${returnPath}`)
    }

    this.props.setLoading()

    // Get all vehicular reports
    NetworkOperation.getVehicularReports().then(({ data }) => {
      data.reports.map(report => {
        this.props.setVehicleReport(report)
      })
    })

    // Get all alarms and history of all sites. But set all sites with this information
    // Reports have all site information
    NetworkOperation.getReports().then(({ data }) => {
      data.reports.map(report => {
        this.props.setReport(report)
        // Populate history array
        report.history.map(currentHistory => {
          currentHistory.site = report.site.key
          currentHistory.zone = report.zone
          this.props.setHistory(currentHistory)
        })
        // Populate alarms array
        report.alarms.map(currentAlarm => {
          currentAlarm.site = report.site.key
          currentAlarm.zone = report.zone
          this.props.setAlarm(currentAlarm)
        })
      })
    })

    // Get User Credentials
    NetworkOperation.getSelf()
      .then(({ data }) => {
        this.setState({
          willCompleteLoad: true
        })
        this.props.setCredentials({ ...data.user, token })

        // Start socket connection
        this.initSockets()

        return NetworkOperation.getExhaustive()
      })
      .then(({ data }) => {
        // Set all zones
        this.props.setExhaustive(data.zones)

        // Set FRM access store
        return NetworkOperation.getAccess()
      })
      .then(({ data }) => {
        const sites = []
        // Iterate over each zone
        this.props.zones.map(zone => {
          // Iterate over each site of each zone
          zone.sites.map(site => {
            sites.push(site)
          })
        })
        data.accessLogs.map(report => {
          if (sites.findIndex($0 => $0.key === report.site) > -1) {
            this.props.setFacialReport(
              report.timestamp,
              report.event,
              report.success,
              report.risk,
              report.zone,
              report.status,
              report.site,
              report.access,
              report.pin,
              report.photo,
              report._id
            )
          }
        })
      })
      .catch(error => {
        const { response = {} } = error

        if (
          response.status === 401 ||
          response.status === 400 ||
          response.status === 404
        ) {
          this.props.history.replace(`/login${returnPath}`)
        }
      })
      .then(() => {
        this.props.setComplete()
        this.setState({
          isLoading: false
        })
      })
  }

  initSockets() {
    this.socket = io()

    this.socket.on('connect', () => {
      this.socket.emit('join', this.props.credentials.company.name)
    })

    this.socket.on('alert', alert => {
      this.props.setAlarm(alert)
      // Add alert popup to GUI
      this.setState(prev => ({
        alerts: prev.alerts.concat([{ ...alert, timestamp: Date.now() }])
      }))
    })
  }

  // Add manual alert
  addManualAlert = () => {
    const alert = {}
    this.setState(prev => ({
      alerts: prev.alerts.concat([{ ...alert, timestamp: Date.now() }])
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
          <p onClick={() => window.location.reload()} className="message">
            Favor de recargar la página
          </p>
          <p className="legend">
            Si el problema persiste, favor de reportarlo a{' '}
            <a href="mailto:soporte@connus.mx">soporte@connus.mx</a>
          </p>
        </div>
      )
    }

    if (this.state.isLoading) {
      return (
        <div id="app">
          <div
            className={`loading-screen ${
              this.state.willCompleteLoad ? 'dismissed' : ''
            }`}>
            <h1>Cargando...</h1>
          </div>
        </div>
      )
    }

    return (
      <div id="app">
        <Helmet>
          <title>Connus</title>
        </Helmet>
        <div className="alerts__container">
          {this.state.alerts.map(alert => (
            <Link to={`/alarms/${alert._id}`} key={alert.timestamp}>
              <div
                className={`alert ${
                  alert.timestamp + 5000 < Date.now() ? 'invalid' : ''
                }`}>
                <div className="alert__image" />
                <div className="alert__body">
                  <p>{alert.site}</p>
                  <p>{alert.event}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Navigator credentials={this.props.credentials} />
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/sites/:zoneId?/:siteId?" component={Map} />
          <Route path="/users" component={Users} />
          <Route path="/accesses" component={Accesses} />
          <Route path="/vehicular-flow" component={VehicularFlow} />
          <Route path="/perimeter" component={Perimeter} />
          <Route path="/facial-recognition" component={FacialRecognition} />
          <Route path="/inventory" component={Inventory} />
          <Route path="/statistics" component={Statistics} />
          <Route path="/video-surveillance" component={VideoSurveillance} />
          <Route path="/visual-counter" component={VisualCounter} />
          <Route path="/reports" component={Reports} />
          <Route path="/settings" component={Settings} />
          <Route path="/sensors" component={Sensors} />
          <Route path="/devices" component={Devices} />
          <Route path="/alarms" component={Alarms} />
          <Route path="/alarms/:alarmId" component={Alarms} />
        </Switch>
      </div>
    )
  }
}

App.propTypes = {
  setCredentials: PropTypes.func,
  history: PropTypes.array,
  user: PropTypes.object,
  credentials: PropTypes.object,
  zones: PropTypes.array,
  location: PropTypes.object,
  setLoading: PropTypes.func,
  setExhaustive: PropTypes.func,
  setComplete: PropTypes.func,
  setFacialReport: PropTypes.func,
  setVehicleReport: PropTypes.func,
  setReport: PropTypes.func,
  setHistory: PropTypes.func,
  setAlarm: PropTypes.func,
  alarms: PropTypes.array
}

function mapDispatchToProps(dispatch) {
  return {
    setReport: report => {
      dispatch(setReport(report))
    },
    setHistory: history => {
      dispatch(setHistory(history))
    },
    setAlarm: alarm => {
      dispatch(setAlarm(alarm))
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
    setFacialReport: (
      timestamp,
      event,
      success,
      risk,
      zone,
      status,
      site,
      access,
      pin,
      photo,
      id
    ) => {
      dispatch(
        setFacialReport(
          timestamp,
          event,
          success,
          risk,
          zone,
          status,
          site,
          access,
          pin,
          photo,
          id
        )
      )
    },
    setVehicleReport: report => {
      dispatch(setVehicleReport(report))
    }
  }
}

function mapStateToProps({ zones, loading, credentials, alarms }) {
  return {
    loading,
    credentials,
    zones,
    alarms
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
