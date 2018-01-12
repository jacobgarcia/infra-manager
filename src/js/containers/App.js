import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import io from 'socket.io-client'

import { setCredentials, setComplete, setLoading, setExhaustive, setReport } from '../actions'
import { Dashboard, Map, Users, Statistics, Settings, Accesses, VehicularFlow, Perimeter, FacialRecognition, Cctv, Reports } from './'
import { Navigator } from '../components'
import { NetworkOperation } from '../lib'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: false
    }

  }
  componentDidMount() {
    const token = localStorage.getItem('token')
    let path = ''
    if (this.props.location.pathname !== '/') {
      path = `?return=${this.props.location.pathname}${this.props.location.search}`
    }

    if (!token) {
      localStorage.removeItem('token')
      this.props.history.replace(`/login${path}`)
      return
    }

    this.props.setLoading()

    NetworkOperation.getSelf()
    .then(({data}) => {
      this.props.setCredentials({...data.user, token})

      // Start socket connection
      this.initSockets(this.props, token)
      return NetworkOperation.getExhaustive()
    })
    .then(({data}) => {
      // Set all zones
      this.props.setExhaustive(data.zones)

      this.props.setComplete()
    })
    .catch(error => {
      const { response = {} } = error
      this.props.setComplete()

      switch (response.status) {
        case 401:
        case 400:
          this.props.history.replace(`/login${path}`)
          break
        default:
          // TODO Display error
          break
      }
    })
  }

  initSockets(props, token) {
    this.socket = io('https://connus.be')

    this.socket.on('connect', () => {
      this.socket.emit('join', token)
    })

    this.socket.on('alert', report => {
      console.log("Alert recieved from external server")
    })
  }

  componentDidCatch(error, info) {
    console.log('ERROR')
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

    return (
      <div id="app">
        <Helmet>
          <title>Connus</title>
        </Helmet>
        <Navigator />
        <Switch>
          <Route exact path="/" component={Dashboard}/>
          <Route path="/sites/:zoneId?/:subzoneId?/:siteId?" component={Map} />
          <Route path="/users" component={Users}/>
          <Route path="/accesses" component={Accesses}/>
          <Route path="/vehicular-flow" component={VehicularFlow}/>
          <Route path="/perimeter" component={Perimeter}/>
          <Route path="/facial-recognition" component={FacialRecognition}/>
          <Route path="/statistics" component={Statistics}/>
          <Route path="/cctv" component={Cctv}/>
          <Route path="/reports" component={Reports}/>
          <Route path="/settings" component={Settings}/>
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
  setComplete: PropTypes.func
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
