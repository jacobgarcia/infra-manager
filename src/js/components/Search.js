import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { ElementStatus, Prompt } from './'
import { getFilteredReports, substractReportValues, getStatus } from '../lib/specialFunctions'

class Search extends Component {
  constructor(props) {
    super(props)

    this.state = {
      query: '',
      sites: [],
      zones: [],
      filteredSites: [],
      filteredZones: []
    }

    this.handleChange = this.handleChange.bind(this)
    this.getLink = this.getLink.bind(this)
    this.setElements = this.setElements.bind(this)
  }

  componentDidMount() {
    this.setElements(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setElements(nextProps)
  }

  setElements(nextProps) {
    if (JSON.stringify(nextProps.zones) === JSON.stringify(this.props.zones.length)) return

    const zones = nextProps.zones.map(({_id: zoneId, name, sites}) =>
      ({
        _id: zoneId,
        name,
        sites: sites.map(({_id, name, key}) =>
          ({
            _id,
            name,
            key,
            zone: zoneId,
          })
        )
      })
    )


    const sites = zones.reduce((sites, zone) =>
      ([
        ...zone.sites,
        ...sites
      ])
    , [])

    this.setState({
      sites,
      zones,
    })
  }

  handleChange(event) {
    const { name, value } = event.target

    if (value === '') {
      this.setState({
        [name]: value,
        filteredSites: [],
        filteredZones: []
      })
      return
    }

    const filteredSites = this.state.sites.filter(site =>
      JSON.stringify(site).toLowerCase()
      .includes(value.toLowerCase())
    )

    const filteredZones = this.state.zones.filter(zone =>
      JSON.stringify(zone).toLowerCase()
      .includes(value.toLowerCase())
    )

    this.setState({
      [name]: value,
      filteredSites,
      filteredZones
    })
  }

  getElementTitle(type) {
    switch (type) {
      case 'GENERAL': return 'Zona'
      case 'ZONE': return 'Sitio'
      case 'SITE': return 'Sensor'
      default: return `Otro`
    }
  }

  getLink(type, element) {
    switch (type) {
      case 'GENERAL': return `/sites/${element._id}`
      case 'ZONE': return `/sites/${element.zone}/${element._id}`
      case 'SUBZONE': return `/sites/${element.zone}/${element._id}`
      default: return `/`
    }
  }

  render() {
    const { state, props } = this

    return (
      <Prompt className={props.isVisible ? 'search-container' : 'hidden'} onDismiss={props.onClose}>
        <div className="search" onClick={evt => evt.stopPropagation()}>
          <div className="header">
            <input
              type="text"
              onChange={this.handleChange}
              value={state.query}
              name="query"
              placeholder="Buscar..."
              autoComplete="off"
              autoCorrect="off"
            />
            <button onClick={this.props.onClose}>Cancelar</button>
          </div>
          <div className="results">
            {
              (state.filteredSites.length > 0)
              &&
              <div className="sites-container">
                <p>Sitios</p>
                {
                  state.filteredSites.map(element => {
                    let reports = getFilteredReports(this.props.reports, {...element, type: 'SITE'})
                    reports = substractReportValues(reports)
                    const { status, percentage } = getStatus(reports || null)

                    return (
                      <Link key={element._id} to={this.getLink('SUBZONE', element)}>
                        <ElementStatus
                          id={element._id}
                          title={this.getElementTitle('SUBZONE')}
                          name={element.name}
                          type={'SUBZONE'}
                          siteKey={element.key}
                          percentage={percentage} // Zone
                          status={status} // Zone
                          alarms={reports ? reports.alarms.length : 0}
                          elements={element.elements} // Subzones or sites
                        />
                      </Link>
                    )
                  })
                }
              </div>
            }
            {
              (this.state.filteredZones.length > 0)
              &&
              <div className="zones-container">
                <p>Zonas</p>
                {
                  this.state.filteredZones.map(element => {
                    let reports = getFilteredReports(this.props.reports, {...element, type: 'ZONE'})
                    reports = substractReportValues(reports)
                    const { status, percentage } = getStatus(reports || null)

                    return (
                      <Link key={element._id} to={this.getLink('GENERAL', element)}>
                        <ElementStatus
                          id={element._id}
                          title={this.getElementTitle('GENERAL')}
                          name={element.name}
                          type={'GENERAL'}
                          siteKey={element.key}
                          percentage={percentage} // Zone
                          status={status} // Zone
                          alarms={reports ? reports.alarms.length : 0}
                          elements={element.elements} // Subzones or sites
                        />
                      </Link>
                    )
                  })
                }
              </div>
            }
          </div>
          </div>
      </Prompt>
    )
  }
}

Search.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  zones: PropTypes.array,
  onClose: PropTypes.func,
  reports: PropTypes.array
}

export default Search
