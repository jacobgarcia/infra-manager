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
      isCreating: false,
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
      error: '',
      streams: [],
      jwts: [],
      frames: []
    }
  }

  componentDidMount() {
    NetworkOperation.getStream()
    .then(({data}) => {
      this.setState({
        streams: data
      },() => {
        data.map(stream => {
          const frame = document.createElement('iframe')
          frame.src = `${stream.core}/?single-player=${stream.streamid}`
          frame.setAttribute('onload', this.init(frame, stream.id))
          const container = document.getElementById(stream._id)
          container.appendChild(frame)
          this.setState({
            frames: [...this.state.frames, frame]
          })
        })
      })
    })
  }

  init(frame, id) {
    NetworkOperation.getStreamToken(id)
    .then(({data}) => {
      this.setState({
        jwts: [...this.state.jwts, data]
      }, () => this.setJWT(frame, this.state.jwts[0]))
    })
    window.setInterval(() => {
      NetworkOperation.getStreamToken(id)
      .then(({data}) => {
        this.setState({
          jwts: [...this.state.jwts, data]
        }, () => this.setJWT(frame, this.state.jwts[0]))
      })
    }, 30000)
  }

  setJWT(frame, jwt) {
    console.log(jwt)
    frame.contentWindow.postMessage({'jwt': jwt}, '*')
    console.log("puse el jwt")
  }

  toggleCreate = () => {

    // Check which element is being created
    if (this.state.isCreating) {
      this.setState({ isCreating: false})
    } else {
      this.setState({ isCreating: true})
    }
    this.setState({
      newPositions: [],
      error: '',
      showing: null,
      url: '',
      user: '',
      pass: '',
      streamid: '',
      site: ''
    })
  }

  onCreateElement = () => {
    NetworkOperation.postStream(
      this.state.url,
      this.state.user,
      this.state.pass,
      this.state.streamid,
      this.state.site.company,
      this.state.site.key,
      this.state.site.name,
      this.state.site._id,
      this.state.site.zone
    )
    .then(({data}) => {
      console.log("well done")
      this.toggleCreate()
    })
    .catch(({ response = {} }) => {
      const { status = 500 } = response
      status === 401 ? this.setState({ error: response.data }) : console.log(response)
    })
  }

  onEntitySelect = data => {
    this.setState({
      site: data
    })
  }

  onElementNameChange = event => {
      const { value, name } = event.target
      this.setState({
       [name]: value,
       isNewElementValid: this.state.url.length > 5 && this.state.user.length > 0 && this.state.pass.length > 0 && this.state.streamid.length >= 0
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
        <div className="grid">
        {
          state.streams && state.streams.map(stream => (
            <div className="item" key={stream._id} id={stream._id}></div>
          ))
        }
        </div>
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
        {
          <CreateElementBarVMS
          onEntitySelect={this.onEntitySelect}
          onCreate={this.onCreateElement}
          onMouseOver={() => this.setState({ hoverPosition: null })}
          className={state.isCreating ? '' : 'hidden'}
          isNewElementValid={state.isNewElementValid}
          onNameChange={this.onElementNameChange}
          url={this.state.url}
          user={this.state.user}
          pass={this.state.pass}
          streamid={this.state.streamid}
          isCreating={state.isCreating}
          error={state.error}
        />
        }
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
