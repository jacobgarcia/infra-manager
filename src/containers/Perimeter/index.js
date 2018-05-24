import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { DateUtils } from 'react-day-picker'
import Slider from 'react-slick'

import { Table, RiskBar, DateRangePicker } from 'components'

class Perimeter extends Component {
  static propTypes = {
    perimeterReports: PropTypes.array
  }

  state = {
    logs: this.props.perimeterReports,
    alerts: [],
    selectedLog:
      this.props.perimeterReports.length > 0
        ? this.props.perimeterReports[0]
        : null,
    selectedElementIndex:
      this.props.perimeterReports.length > 0 ? [0, 0] : [null, null],
    showLogDetail: true,
    from: new Date(),
    to: new Date()
  }

  onLogSelect: Function = (item, index, sectionIndex) => {
    this.setState({
      showLogDetail: true,
      selectedLog: item,
      selectedElementIndex: [index, sectionIndex]
    })

    this.forceUpdate()
  }

  onDayClick: Function = day => {
    // TODO Network operation for selected period
    const range = DateUtils.addDayToRange(day, this.state)
    this.setState(range)
  }

  render() {
    const { state, props } = this

    return (
      <div className="app-content perimeter small-padding">
        <Helmet>
          <title>Connus | Perímetro</title>
        </Helmet>
        <div className="content">
          <h2>
            Perímetro
            <div className="actions-container">
              <DateRangePicker
                from={state.from}
                to={state.to}
                onDayClick={this.onDayClick}
              />
              <p className="button action disabled">Filtrar</p>
            </div>
          </h2>
          <div className="tables-detail__container">
            <div
              className={`log-detail-container ${
                state.showLogDetail ? '' : 'hidden'
              }`}>
              <div className="content">
                {/* <span onClick={() => this.setState({ showLogDetail: false, selectedElementIndex: [null,null] })} className="close">Cerrar</span> */}
                <div className="time-location">
                  <p>
                    {state.selectedLog.timestamp &&
                      `${state.selectedLog.timestamp.toLocaleDateString(
                        'es-MX'
                      )} ${state.selectedLog.timestamp.toLocaleTimeString()}`}
                  </p>
                  <p>
                    Zona <span>{state.selectedLog.zone.name}</span> Sitio{' '}
                    <span>{state.selectedLog.site}</span>
                  </p>
                </div>
                <div>
                  <video width="360" height="240" loop muted autoPlay>
                    <source
                      src={
                        '/static/video/dummy/perimeter-0' +
                        this.state.selectedElementIndex[0] +
                        '.mp4'
                      }
                      type="video/mp4"
                    />
                  </video>
                </div>
                <div className="detail">
                  <span>Galería</span>
                  <Slider
                    nextArrow={<button>{'>'}</button>}
                    prevArrow={<button>{'<'}</button>}>
                    <div
                      className="image-slider"
                      style={{
                        backgroundImage:
                          `url(/static/img/dummy/perimterg-0` +
                          this.state.selectedElementIndex[0] +
                          `.png)`
                      }}
                    />
                    <div
                      className="image-slider"
                      style={{
                        backgroundImage:
                          `url(/static/img/dummy/perimterg-1` +
                          this.state.selectedElementIndex[0] +
                          `.png)`
                      }}
                    />
                    <div
                      className="image-slider"
                      style={{
                        backgroundImage:
                          `url(/static/img/dummy/perimterg-2` +
                          this.state.selectedElementIndex[0] +
                          `.png)`
                      }}
                    />
                    <div
                      className="image-slider"
                      style={{
                        backgroundImage:
                          `url(/static/img/dummy/perimterg-3` +
                          this.state.selectedElementIndex[0] +
                          `.png)`
                      }}
                    />
                  </Slider>
                </div>
                <div className="action destructive">
                  <p>Contactar seguridad</p>
                </div>
              </div>
            </div>
            <div className="tables-container">
              <Table
                className={`${state.showLogDetail ? 'detailed' : ''}`}
                selectedElementIndex={state.selectedElementIndex}
                element={(item, index, sectionIndex) => (
                  <div
                    className={`table-item ${
                      state.selectedElementIndex[0] === index &&
                      state.selectedElementIndex[1] === sectionIndex
                        ? 'selected'
                        : ''
                    }`}
                    key={index}
                    onClick={() => this.onLogSelect(item, index, sectionIndex)}>
                    <div className="medium">
                      {item.timestamp &&
                        `${item.timestamp.toLocaleDateString(
                          'es-MX'
                        )} ${item.timestamp.toLocaleTimeString()}`}
                    </div>
                    <div className="large">{item.event}</div>
                    {/* <div className="hiddable">{item.zone}</div> */}
                    <div className="hiddable">{item.site}</div>
                    <div>
                      <RiskBar risk={item.risk} />
                    </div>
                    <div className="medium hiddable">{item.status}</div>
                  </div>
                )}
                title="Registros"
                elements={props.perimeterReports.filter($0 => $0.risk === 0)}
                titles={[
                  { title: 'Tiempo', className: 'medium' },
                  { title: 'Suceso', className: 'large' },
                  // {title: 'Zona', className: 'hiddable'},
                  { title: 'Sitio', className: 'hiddable' },
                  { title: 'Riesgo' },
                  { title: 'Estatus o acción', className: 'medium hiddable' }
                ]}
              />
              <Table
                className={`${state.showLogDetail ? 'detailed' : ''}`}
                selectedElementIndex={state.selectedElementIndex}
                element={(item, index) => (
                  <div
                    className={`table-item ${
                      state.selectedElementIndex[0] === index &&
                      state.selectedElementIndex[1] === 1
                        ? 'selected'
                        : ''
                    }`}
                    key={index}
                    onClick={() => this.onLogSelect(item, index, 1)}>
                    <div className="medium">
                      {item.timestamp &&
                        `${item.timestamp.toLocaleDateString(
                          'es-MX'
                        )} ${item.timestamp.toLocaleTimeString()}`}
                    </div>
                    <div className="large">{item.event}</div>
                    {/* <div className="hiddable">{item.zone}</div> */}
                    <div className="hiddable">{item.site}</div>
                    <div>
                      <RiskBar risk={item.risk} />
                    </div>
                    <div className="medium hiddable">{item.status}</div>
                  </div>
                )}
                title="Alertas"
                elements={props.perimeterReports.filter($0 => $0.risk > 0)}
                titles={[
                  { title: 'Tiempo', className: 'medium' },
                  { title: 'Suceso', className: 'large' },
                  // {title: 'Zona', className: 'hiddable'},
                  { title: 'Sitio', className: 'hiddable' },
                  { title: 'Riesgo' },
                  { title: 'Estatus o acción', className: 'medium hiddable' }
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ perimeterReports }) {
  return {
    perimeterReports
  }
}

export default connect(mapStateToProps)(Perimeter)
