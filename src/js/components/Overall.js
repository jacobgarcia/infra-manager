import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { StatusesContainer } from './'
import Constants from '../lib/constants'
import { substractReportValues, getStatus } from '../lib/specialFunctions'

class Overall extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        alarms: []
      },
      percentage: 0,
      status: null,
      isHidden: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.reports) return

    if (nextProps.reports.length !== this.props.reports.length) {
      this.setState({
        data: substractReportValues(nextProps.reports)
      }, () => {
        const { status, percentage } = getStatus(this.state.data || null)

        this.setState({
          status,
          percentage
        })
      })
    }
  }

  getBackLink({selectedType: type, params}) {
    switch (type) {
      case 'ZONE': return '/sites'
      case 'SUBZONE': return `/sites/${params.zoneId}`
      case 'SITE': return `/sites/${params.zoneId}/${params.subzoneId}`
      default: return '/sites'
    }
  }

  getTitle({siteId, subzoneId, zoneId}, name) {
    if (siteId) {
      return `Sitio ${name}`
    } else if (subzoneId) {
      return `Subzona ${name}`
    } else if (zoneId) {
      return `Zona ${name}`
    }
    return 'Estatus general'
  }

  render() {
    const { state, props } = this

    return (
      <div className={`overall ${state.isHidden ? 'hidden' : ''}`}>
        <div className="tooltip" onClick={() => this.setState(prev => ({ isHidden: !prev.isHidden }))} />
        <div className="content">
          <div className="mini-header">
            <span>{props.selectedType !== 'GENERAL' && <Link to={this.getBackLink(props)}>Regresar</Link>}</span>
            {/* <span className="pop-window">Hacer ventana</span> */}
          </div>
          <div className="overall-header">
            <h3>{this.getTitle(props.params, props.element && props.element.name)}</h3>
            <span className="leyend">{state.percentage}%</span>
            <div className="bar-container">
              <div className="normal" style={{width: `${state.percentage}%`, backgroundColor: Constants.colors(state.percentage)}} />
              <div className="alert" style={{width: `${100 - state.percentage}%`}} />
            </div>
          </div>
          <StatusesContainer
            params={props.params}
            type={props.selectedType}
            elements={props.selectedType === 'SITE' ? (props.element ? props.element.sensors : []) : props.elements}
            reports={props.reports}
            onHover={props.onHover}
            element={props.element}
          />
        </div>
      </div>
    )
  }
}

Overall.propTypes = {
  selectedType: PropTypes.string.isRequired,
  reports: PropTypes.array
}

Overall.defaultProps = {
  reports: []
}

export default Overall
