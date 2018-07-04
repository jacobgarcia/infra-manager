import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { NetworkOperation } from 'lib'

import Search from 'components/Search'
import CreateElementBarVMS from 'components/CreateElementBarVMS'
import { setLoading, setComplete, setSubzone, setZone, setSite } from 'actions'

class VideoSurveillance extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentZoom: 3,
      shadow: null,
      element: null,
      elements: [],
      hoverElement: null,
      isCreating: null,
      showing: null,
      states: [],
      isSearching: false,
      elementHover: null,
      visibleMarkers: false,
      hoverPosition: [], // For area creation
      newPositions: [], // New element
      isNewElementValid: false,
      url: '',
      user: '',
      pass: '',
      streamid: '',
      availableSites: [], // Current available sites
      workingVMSEndpoint: [],
      streamID: [],
      error: ''
    }
  }

  componentDidMount() {
    //const frame1 = document.createElement('iframe')
    //frame1.setAttribute('onload', this.init(frame1))
    //frame1.src = "http://f7b73757.ngrok.io/?single-player=1"
    //frame1.orchidId = "fdfacc2f-4c42-4484-bbb1-9ba7dd4372fc"
    //console.log("src defining")
    //container = document.getElementById('players')
    //console.log("apending C")
    //container.appendChild(frame1)
  }

  init(frame) {
    this.getFusionToken(token => {
        this.renewJWT(frame, token)
        window.setInterval(() => {
          this.renewJWT(frame, token)
        }, 30000)
      }
    )
  }

  setJWT(frame, jwt) {
    console.log(jwt)
    frame.contentWindow.postMessage({'jwt': jwt}, '*')
    console.log("puse el jwt")
  }

  renewJWT(frame, token) {
    NetworkOperation.getJWT()
      .then(({data}) => {
        this.setJWT(frame, token)
      })
      console.log("JWT obtained")
      .catch(({response = {} }) => {
        const { status = 500 } = response
        console.log(status)
      })
  }


  toggleCreate = () => {

    // Check which element is being created
    let isCreating = null
    if (this.state.isCreating) {
      isCreating = null
    } else {
      isCreating = true
    }
    this.setState({
      newPositions: [],
      isCreating,
      error: '',
      showing: null
    })
  }

  onCreateElement = () => {
  }

  onElementNameChange = event => {
      const { value, name } = event.target
      this.setState({
       [name]: value,
       isNewElementValid: this.state.url.length > 5 && this.state.user.length > 0 && this.state.pass.length > 0 && this.state.streamid.length > 0
      })
  }

  render() {
    const {state, props} = this
    return (
      <div
        id="vms-container"
        className={state.isCreating ? 'creating-element' : ''}>
        <Helmet>
          <title>Connus | VideoSurveillance</title>
        </Helmet>
        <div
          className="bar-actions"
          onMouseMove={() =>
            state.isCreating && this.setState({ hoverPosition: null })
          }>
          <div>
            <span
                  className="button back"
                  onClick={() => {
                    if (state.isCreating) this.toggleCreate()
                  }}>
            </span>
          </div>
          {
            <ul className={`links hiddable ${state.isCreating && 'hidden'}`}>
              <li className="button search" onClick={this.onToggleSearch}>
                <span className="search">Buscar</span>
              </li>
              {(
                <li className="button create" onClick={this.toggleCreate}>
                  <span className="create">
                    Añadir VMS
                  </span>
                </li>
              )}
            </ul>
          }
          <div>
            {state.isCreating && (
              <span
                className="button huge cancel destructive"
                onClick={this.toggleCreate}>
                Cancelar
              </span>
            )}
          </div>
        </div>
        <CreateElementBarVMS
          onEntitySelect={this.onEntitySelect}
          onCreate={this.onCreateElement}
          onMouseOver={() => this.setState({ hoverPosition: null })}
          className={state.isCreating ? '' : 'hidden'}
          isNewElementValid={state.isNewElementValid}
          onNameChange={this.onElementNameChange}
          onPositionsChange={this.onElementPositionsChange}
          positions={state.newPositions}
          error={state.error}
          clean={state.isCreating}
        />
      </div>
    )
  }
}

VideoSurveillance.propTypes = {
  cameraReports: PropTypes.array,
  history: PropTypes.object,
  zones: PropTypes.array,
  match: PropTypes.object,
  reports: PropTypes.array,
  setSite: PropTypes.func,
  setZone: PropTypes.func,
  setSubzone: PropTypes.func,
  credentials: PropTypes.object
}

VideoSurveillance.defaultProps = {
  user: {}
}

function mapStateToProps(props) {
  const { zones, reports, credentials, cameraReports } = props
  return {
    cameraReports,
    zones,
    reports,
    credentials
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setLoading: () => {
      dispatch(setLoading())
    },
    setComplete: () => {
      dispatch(setComplete())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoSurveillance)
