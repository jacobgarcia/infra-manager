/* eslint max-statements: ["error", 15] */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Map, TileLayer, Polygon as LeafletPolygon, Circle } from 'react-leaflet'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import { Overall, Polygon, Marker, Search, CreateElementBar } from '../components'
import { NetworkOperation, NetworkOperationFRM } from '../lib'
import { setLoading, setComplete, setReport, setSubzone, setZone, setSite } from '../actions'
import { getAreaCenter } from '../lib/specialFunctions'

class MapContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentPosition: (props.credentials.user && props.credentials.user.defaultPosition) || [23.2096057, -101.6139503],
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
      newElementName: '',
      isNewElementValid: false,
      availableSites: [] // Current available sites
    }

    this.getElementsToRender = this.getElementsToRender.bind(this)
    this.onElementOver = this.onElementOver.bind(this)
    this.toggleVisible = this.toggleVisible.bind(this)
    this.onToggleSearch = this.onToggleSearch.bind(this)
    this.toggleCreate = this.toggleCreate.bind(this)
    this.onViewportChanged = this.onViewportChanged.bind(this)
    // MAP
    this.onMapClick = this.onMapClick.bind(this)
    this.onEntitySelect = this.onEntitySelect.bind(this)
    this.onElementNameChange = this.onElementNameChange.bind(this)
    this.onElementPositionsChange = this.onElementPositionsChange.bind(this)
    this.onCreateElement = this.onCreateElement.bind(this)
    this.arrayDifference = this.arrayDifference.bind(this)
  }

  arrayDifference (arrayOne, arrayTwo) {
    var ret = []
    arrayOne.sort()
    arrayTwo.sort()
    // Compare only with keys
    const arrayTwoKeys = arrayTwo.map(a => a.key)
    for (let i = 0; i < arrayOne.length; i += 1) {
        if(arrayTwoKeys.indexOf(arrayOne[i]) > -1){
            ret.push(arrayTwo[arrayTwoKeys.indexOf(arrayOne[i])])
        }
    }
    return ret
  }

  onViewportChanged({zoom}) {
    if (zoom > 12) {
      this.setState({
        visibleMarkers: true
      })
    } else {
      this.setState({
        visibleMarkers: false
      })
    }
  }

  componentDidMount() {

    NetworkOperation.getAvailableStates()
    .then(({data}) => {
      this.setState({
        states: data.states
      })
    })

    NetworkOperation.getReports()
    .then(({data}) => {
      data.reports.forEach(report => {
        this.props.setReport(report)
      })
    })

    NetworkOperationFRM.getAvailableSites()
    .then(({data}) => {
       this.setState({
         availableSites: data.connected_sites
       })

       const { elements = [] } = this.getElementsToRender(this.props)
       this.setState({
         elements
       })
    }).catch(console.error)



      setInterval(() => {

        NetworkOperation.getAvailableStates()
        .then(({data}) => {
          this.setState({
            states: data.states
          })
        })

        NetworkOperation.getReports()
        .then(({data}) => {

          data.reports.forEach(report => {
            this.props.setReport(report)
          })
        })

        NetworkOperationFRM.getAvailableSites()
        .then(({data}) => {
           this.setState({
             availableSites: data.connected_sites
           })

           const { elements = [] } = this.getElementsToRender(this.props)
           this.setState({
             elements
           })
        }).catch(console.error)

      }, 30000)
  }

  componentWillReceiveProps(nextProps) {
    const { zoneId = null, siteId = null } = nextProps.match.params
    if (this.props.match.params === nextProps.match.params) return
    if (nextProps.credentials.user && nextProps.credentials.user.defaultPosition) {
      this.setState({
        currentPosition: nextProps.credentials.user.defaultPosition
      })
    }
    if (nextProps.zones.length === 0) return

    // If we have the same paramters dont update the state
    if (zoneId === null && siteId === null) {
      const { elements = [], shadow = null } = this.getElementsToRender(nextProps)
      this.setState({
        elements,
        shadow,
        currentZoom: 5
      })
      return
    }

    this.setState({
      elements: [], // !important
      currentPosition: null // !important
    }, () => {
      // Get elements to render and the shadow polygon
      const { elements = [], element = null, shadow = null } = this.getElementsToRender(nextProps)

      // Update state
      this.setState(prev => ({
        currentPosition: siteId ? element.position : shadow ? getAreaCenter(shadow) : prev.currentPosition,
        currentZoom: siteId ? 13 : zoneId ? 7 : 5,
        element,
        shadow,
        elements
      }))
    })
  }

  toggleCreate() {
    const { zoneId = null } = this.props.match.params

    this.setState(prev => ({
      newPositions: [],
      isCreating: prev.isCreating ? null : zoneId ? 'SITE' : 'ZONE',
      showing: null
    }))
  }

  getElementsToRender(props) {
    const { zoneId = null, siteId = null } = props.match.params

    if (!this.props.zones || this.props.zones.length === 0) return { elements: [], shadow: null }

    if (siteId) {
      const { sites = [], positions } = this.props.zones.find(({_id}) => _id === zoneId)
      const element = sites.find(({_id}) => _id === siteId)
      const availableSites = this.arrayDifference(this.state.availableSites, sites)

      return {
        elements: availableSites,
        shadow: positions,
        element
      }
    } else if (zoneId) {
      const zone = this.props.zones.find(({_id}) => _id === zoneId)
      const { sites = [], positions: shadow } = zone
      const availableSites = this.arrayDifference(this.state.availableSites, sites)

      return {
        elements: availableSites.map(site => ({...site, type: 'SITE'})),
        shadow,
        element: { _id: zone._id, name: zone.name }
      }
    }


    return {
      elements: this.props.zones.map(({name, positions, _id, sites = []}) => ({name, positions, _id, elements: this.state.availableSites.length, type: 'ZONE'})),
      shadow: null,
      element: null
    }
  }

  onToggleSearch() {
    this.setState(prev => ({
      isSearching: !prev.isSearching,
    }))
  }

  onElementNameChange(event) {
    const { value } = event.target

    this.setState({
      newElementName: value,
      isNewElementValid: this.state.newPositions.length > 0 && value.length > 0
    })
  }

  onElementPositionsChange(event) {
    let value = event.target.value
    const name = event.target.name
    // Remove all non-numbers and no '-' or '.'
    if (value.length > 0) value = value.match(/[-\d.]/g).join('')

    // Update the last position, since this is the one we're usingto display
    const positions = (this.state.newPositions.length > 0) ? this.state.newPositions : [[]]

    name === 'lat'
    ? positions[positions.length - 1][0] ? positions[positions.length - 1][0] = value : positions[positions.length - 1] = [value, 0]
    : positions[positions.length - 1][1] ? positions[positions.length - 1][1] = value : positions[positions.length - 1] = [0, value]

    this.setState({
      newPositions: positions,
      isNewElementValid: this.state.newElementName.length > 0 && positions.length > 0
    })
  }

  onEntitySelect({name, positions}) {
    this.setState({
      newPositions: positions,
      newElementName: name
    })
  }

  onElementOver(elementId) {
    this.setState({
      hoverElement: elementId
    })
  }

  toggleVisible(element) {
    this.setState(prev => ({
      showing: prev.showing === element ? null : element
    }))
  }

  getElementReports() {
    const { zoneId = null, siteId = null } = this.props.match.params

    if (siteId) {
      return this.props.reports.filter(({site}) => site._id === siteId)
    } else if (zoneId) {
      return this.props.reports.filter(({zone}) => zone._id === zoneId)
    }
    return this.props.reports
  }

  onMapClick(event) {
    if (!this.state.isCreating) return

    const { lat, lng } = event.latlng
    const newPosition = [lat,lng]

    this.setState(prev => ({
      newPositions: prev.newPositions.concat([newPosition])
    }))
  }

  onCreateElement() {
    const { zoneId: selectedZone = null} = this.props.match.params
    const { newPositions, newElementName } = this.state

    if (selectedZone) {
      NetworkOperation.setSite(selectedZone, newElementName, Date.now(), newPositions[newPositions.length - 1])
      .then(({data}) => {
        this.setState({ newPositions: [], newElementName: '', isCreating: null, showing: null })
        this.props.setSite(data.site.zone, data.site._id, data.site.key, data.site.name, data.site.position)
      })
      .catch(console.warn)
    } else {
      NetworkOperation.setZone(newElementName, newPositions)
      .then(({data}) => {
        this.setState({ newPositions: [], newElementName: '', isCreating: null, showing: null })
        this.props.setZone(data.zone._id, data.zone.name, data.zone.positions)
      })
      .catch(console.warn)
    }
  }

  render() {
    const { state, props } = this
    if (!props.credentials.user) {
      return (null)
    }

    const { zoneId: selectedZone = null, siteId: selectedSite = null } = props.match.params

    return (
      <div id="map-container" className={state.isCreating ? 'creating-element' : ''}>
        <Helmet>
          <title>Connus | Sitios</title>
        </Helmet>
        <Overall
          params={props.match.params}
          alerts={null}
          onHover={this.onElementOver}
          elements={state.elements}
          selectedType={selectedSite ? 'SITE' : selectedZone ? 'ZONE' : 'GENERAL'}
          onVisibleToggle={() => this.toggleVisible('OVERALL')}
          reports={this.getElementReports()}
          element={state.element}
          isCreating={state.isCreating}
        />
        {
          state.isSearching
          &&
          <Search
            isVisible={state.isSearching}
            zones={props.zones}
            onClose={this.onToggleSearch}
            reports={props.reports}
          />
        }
        <Map
          center={state.currentPosition}
          ref={map => {
            this.map = map
          }}
          zoom={state.currentZoom}
          onClick={this.onMapClick}
          onViewportChanged={this.onViewportChanged}
          onMouseMove={({latlng}) => state.isCreating && this.setState({ hoverPosition: [latlng.lat, latlng.lng] })}
          animate
        >
          <div className="bar-actions" onMouseMove={() => state.isCreating && this.setState({hoverPosition: null})}>
            <div>
              {
                (selectedZone && state.showing !== 'OVERALL' && !state.isCreating)
                &&
                <span className="button back" onClick={() => {
                    if (state.isCreating) this.toggleCreate()
                    if (selectedSite) props.history.push(`/sites/${selectedZone}`)
                    else if (selectedZone) props.history.push('/sites')
                }}>Regresar <span>{selectedSite ? 'zona' : 'general'}</span></span>
              }
            </div>
            {
              <ul className={`links hiddable ${state.isCreating && 'hidden'}`}>
                <li className="button search"
                  onClick={this.onToggleSearch}>
                  <span className="search">Buscar</span>
                </li>
                {
                  !selectedSite
                  &&
                  <li className="button create"
                    onClick={this.toggleCreate}>
                    <span className="create">{selectedZone ? 'Sitio' : 'Zona'}</span>
                  </li>
                }
              </ul>
            }
            <div>
              {
                state.isCreating
                &&
                <span className="button huge cancel destructive" onClick={this.toggleCreate}>Cancelar</span>
              }
            </div>
          </div>

          {
            state.shadow
            &&
            <LeafletPolygon
              positions={[
                [[-85,-180], [-85,180], [85,180], [85,-180]],
                [...(state.shadow || [])]
              ]}
              fillOpacity={0.3}
              color="#666"
              weight={0}
              onClick={() => {
                if (state.isCreating) return null
                if (selectedSite) return props.history.push(`/sites/${selectedZone}`)
                if (selectedZone) return props.history.push(`/sites`)
                return null
              }}
            />
          }
          {
            (selectedZone && state.elements)
            ?
            state.elements.map(element =>
              <Marker
                key={element._id}
                position={element.position || []}
                site={element}
                title={element.name}
                reports={this.props.reports.filter(({site: reportSite}) =>
                  reportSite.key === element.key
                )}
                isTooltipVisible={state.visibleMarkers}
                isHighlighted={this.state.hoverElement === element._id}
                onMouseHover={this.onElementOver}
                isSite={selectedZone !== null}
                sensors={selectedSite ? state.element : element }
                onClick={() => {
                  if (selectedSite === element._id) {
                    this.setState({
                      showing: 'OVERALL'
                    })
                  }
                  props.history.push(`/sites/${selectedZone}/${element._id}`)
                }}
              />
            )
            :
            state.elements.map(element =>
              <Polygon
                key={element._id}
                zone={element}
                reports={(() => {
                  let reports = []
                  if (selectedZone) {
                    reports = props.reports.filter(({zone}) => zone._id === element._id)
                  }
                  return reports
                })()}
                highlighted={element._id === state.hoverElement}
                onMouseHover={this.onElementOver}
                onClick={() => {
                  if (state.isCreating !== null) return null
                  if (selectedZone === null) return props.history.push(`/sites/${element._id}`)
                  return null
                }}
              />
            )
          }
          {
            state.isCreating
            &&
            (selectedZone
            ?
            <Marker
              position={state.newPositions && state.newPositions[0] ? state.newPositions[state.newPositions.length - 1] : [0,0]}
              site={{name: state.newElementName}}
              title={state.newElementName}
            />
            :
            <LeafletPolygon
              weight={1}
              positions={state.hoverPosition ? [...state.newPositions, state.hoverPosition] : state.newPositions}
            />)
          }
          {
            state.isCreating && !selectedZone
            &&
            state.newPositions.map((position, index) =>
              <Circle
                key={index}
                radius={5}
                center={position}
              />
            )
          }
          <TileLayer
            url={`https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}${window.devicePixelRatio > 1 ? '@2' : ''}.png`}
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
          />
        </Map>
        <CreateElementBar
          onEntitySelect={this.onEntitySelect}
          onCreate={this.onCreateElement}
          onMouseOver={() => this.setState({hoverPosition: null})}
          className={state.isCreating ? '' : 'hidden'}
          isNewElementValid={state.isNewElementValid}
          isCreatingSite={Boolean(selectedZone)}
          onNameChange={this.onElementNameChange}
          onPositionsChange={this.onElementPositionsChange}
          positions={state.newPositions}
        />
      </div>
    )
  }
}

MapContainer.propTypes = {
  history: PropTypes.object,
  zones: PropTypes.array,
  match: PropTypes.object,
  reports: PropTypes.array,
  setReport: PropTypes.func,
  setSite: PropTypes.func,
  setZone: PropTypes.func,
  setSubzone: PropTypes.func,
  credentials: PropTypes.object
}

function mapStateToProps({zones, reports, credentials}) {
  return {
    zones,
    reports,
    credentials
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setZone: (id, name, positions) => {
      dispatch(setZone(id, name, positions))
    },
    setSubzone: (zoneId, name, positions) => {
      dispatch(setSubzone(zoneId, name, positions))
    },
    setSite: (zoneId, siteId, key, name, position) => {
      dispatch(setSite(zoneId, siteId, key, name, position))
    },
    setLoading: () => {
      dispatch(setLoading())
    },
    setComplete: () => {
      dispatch(setComplete())
    },
    setReport: report => {
      dispatch(setReport(report))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer)
