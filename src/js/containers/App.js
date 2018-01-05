import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import { Dashboard, Services, Map, Users, Statistics, Settings } from './'
import { Navigator } from '../components'
// import { NetworkOperation } from '../lib/NetworkOperation'

class App extends Component {
  componentWillMount() {
    // TODO Verify auth
    // TODO Get user
  }

  render() {
    return (
      <div id="app">
        <Helmet>
          <title>Connus</title>
        </Helmet>
        <Navigator />
        <Switch>
          <Route exact path="/" component={Dashboard}/>
          <Route path="/services" component={Services}/>
          <Route path="/sites" component={Map}/>
          <Route path="/users" component={Users}/>
          <Route path="/statistics" component={Statistics}/>
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
  credentials: PropTypes.object
}

function mapDispatchToProps(dispatch) {
  return {}
}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
