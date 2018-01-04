import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import { Dashboard } from './'
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
