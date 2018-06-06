import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  XAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  Area,
  ResponsiveContainer,
  ComposedChart,
  YAxis,
  Bar,
  Line
} from 'recharts'

import Card from 'components/Card'
import Table from 'components/Table'
import RiskBar from 'components/RiskBar'
import Tooltip from 'components/Tooltip'
import { blue, darkGray } from 'lib/colors'
import { getColor, dataChart } from 'lib/specialFunctions'
import { NetworkOperation } from 'lib'

class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedElementIndex: [null, null],
      detail: null,
      worstZone: null,
      chartCounter: [
        { name: '7:00 AM', uv: 9, pv: 1042, tv: 92 },
        { name: '8:00 AM', uv: 31, pv: 1042, tv: 34 },
        { name: '9:00 AM', uv: 26, pv: 1043, tv: 93 },
        { name: '10:00 AM', uv: 28, pv: 940, tv: 40 },
        { name: '11:00 AM', uv: 17, pv: 1241, tv: 541 },
        { name: '12:00 PM', uv: 7, pv: 1043, tv: 53 },
        { name: '1:00 PM', uv: 5, pv: 1204, tv: 14 },
        { name: '2:00 PM', uv: 6, pv: 1143, tv: 443 },
        { name: '3:00 PM', uv: 4, pv: 1443, tv: 263 },
        { name: '4:00 PM', uv: 5, pv: 1143, tv: 583 },
        { name: '5:00 PM', uv: 12, pv: 1143, tv: 583 },
        { name: '6:00 PM', uv: 31, pv: 1042, tv: 43 },
        { name: '7:00 PM', uv: 0, pv: 1042, tv: 51 }
      ],
      history: [],
      alarms: [],
      data: [
        { name: 'workings', value: 75 },
        { name: 'alerts', value: 15 },
        { name: 'damaged', value: 10 }
      ]
    }
  }

  componentDidMount() {
    const { props } = this
    const history = []
    const alarms = []
    const alertedZones = []
    const alertedSites = []
    const chart = []

    props.reports.map(site => {
      site.history.map(currentHistory => {
        // Populate chart dates
        chart.push(new Date(currentHistory.timestamp))
        // Populate history array
        currentHistory.site = site.site.key
        history.push(currentHistory)
      })

      // Populate alarms array
      site.alarms.map(currentAlarm => {
        currentAlarm.site = site.site.key
        alarms.push(currentAlarm)
      })

      // Most alerted zone
      const zone = alertedZones.find($0 => $0.name === site.zone.name)
      if (zone) {
        zone.value += site.alarms.length
      } else {
        const alertedZone = {
          name: site.zone.name,
          value: site.alarms.length
        }
        alertedZones.push(alertedZone)
      }

      // Most alerted site
      const theSite = alertedSites.find($0 => $0.name === site.site.key)
      if (theSite) {
        theSite.value += site.alarms.length
      } else {
        const alertedSite = {
          name: site.site.key,
          value: site.alarms.length,
          history: site.history
        }
        alertedSites.push(alertedSite)
      }
    })

    // Find the most alerted site
    const worstSite = alertedSites.find(
      $0 => $0.value === Math.max(...alertedSites.map($0 => $0.value))
    )

    // Find the most alerted zone
    const worstZone = alertedZones.find(
      $0 => $0.value === Math.max(...alertedZones.map($0 => $0.value))
    )

    const weeklyAlerts = {
      history: worstSite.history.filter(
        $0 => $0.timestamp > Date.now() - 604800000 && $0.timestamp < Date.now()
      ), // 1 week difference
      key: worstSite.name
    }

    this.setState({
      history,
      alarms,
      worstZone,
      sites: props.reports,
      worstSite,
      weeklyAlerts,
      chart
    })

    NetworkOperation.getAvailableSites().then(currentSites => {
      NetworkOperation.getSites().then(allSites => {
        // CIRCULAR Chart
        const workings = allSites.data.sites.filter(
          site =>
            currentSites.data.connected_sites.includes(site.key) &&
            site.alarms.length === 0
        )

        const damaged = allSites.data.sites.filter(
          site => !currentSites.data.connected_sites.includes(site.key)
        )

        const alerted = allSites.data.sites.filter(
          site =>
            site.alarms.length > 0 &&
            currentSites.data.connected_sites.includes(site.key)
        )

        const tempData = [
          {
            name: 'workings',
            value: workings.length
          },
          {
            name: 'alerts',
            value: alerted.length
          },
          {
            name: 'damaged',
            value: damaged.length
          }
        ]

        this.setState({
          ok: parseInt(workings.length / allSites.data.sites.length * 100, 10),
          bad: parseInt(damaged.length / allSites.data.sites.length * 100, 10),
          war: parseInt(alerted.length / allSites.data.sites.length * 100, 10),
          sensors: tempData
        })
      })
    })

    // Get Visual Counter information
    NetworkOperation.getCounter().then(({ data }) => {
      const { chartCounter } = this.state
      data.counts.map((count, index) => {
        chartCounter[11].uv = 0
        chartCounter[index].uv = count
        this.setState({
          chartCounter
        })
      })
    })
  }
  render() {
    const { state } = this
    return (
      <div className="dashboard app-content small-padding">
        <div className="content">
          <h2>
            Estatus <div className="actions" />
          </h2>
          <div className="overall-container">
            <div
              className={`horizontal-container ${
                state.detail !== null ? 'minified' : ''
              }`}>
              <div className="vertical-container">
                <Card
                  title="Rendimiento general"
                  className={`graph-container`}
                  full={
                    state.detail === 'warning' || state.detail === 'damaged'
                  }
                  detailView={
                    <div className="detail-view">
                      <h1>
                        {this.state.sensors && this.state.sensors[2].value}
                        <p>
                          /{this.state.sensors &&
                            this.state.sensors[0].value +
                              this.state.sensors[1].value +
                              this.state.sensors[2].value}{' '}
                          equipos offline (<span>{this.state.bad}%</span>)
                        </p>
                      </h1>
                      <Table
                        multipleTable
                        actionsContainer={
                          <div>
                            <p className="button action disabled">Filtrar</p>
                          </div>
                        }
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
                            onClick={() =>
                              this.onLogSelect(item, index, sectionIndex)
                            }>
                            {item.timestamp && (
                              <div>
                                {
                                  item.timestamp /* .toLocaleDateString('es-MX') ? item.timestamp.toLocaleDateString('es-MX'): item.timestamp*/
                                }{' '}
                              </div>
                            )}
                            <div className="medium bold">{item.event}</div>
                            <div className="medium">{item.status}</div>
                            <div>
                              <RiskBar risk={item.risk} />
                            </div>
                            <div>{item.site}</div>
                            <div>{item.risk}</div>
                          </div>
                        )}
                        elements={[
                          {
                            title: 'Offline',
                            elements:
                              this.state.history &&
                              this.state.history.length > 0
                                ? this.state.history.filter(
                                    history => history.risk > 2
                                  )
                                : null
                          },
                          {
                            title: 'Alertados',
                            elements:
                              this.state.history &&
                              this.state.history.length > 0
                                ? this.state.history.filter(
                                    history => history.risk < 3
                                  )
                                : null
                          }
                        ]}
                        titles={[
                          { title: 'Tiempo' },
                          { title: 'Sitio', className: 'medium' },
                          { title: 'Estatus' },
                          { title: 'Zona', className: 'medium' },
                          { title: 'Riesgo' },
                          { title: 'Suceso' }
                        ]}
                      />
                    </div>
                  }
                  detailActions={
                    <p onClick={() => this.setState({ detail: null })}>
                      Cerrar
                    </p>
                  }>
                  <div className="graph">
                    <PieChart width={200} height={200}>
                      <Pie
                        animationBegin={0}
                        dataKey="value"
                        data={this.state.sensors}
                        cx={95}
                        cy={95}
                        innerRadius={60}
                        outerRadius={95}
                        strokeWidth={0}
                        label>
                        {this.state.data.map(({ name }, index) => (
                          <Cell key={index} fill={getColor(name)} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        isAnimationActive={false}
                        content={Tooltip}
                      />
                    </PieChart>
                    <h1>{this.state.ok}%</h1>
                  </div>
                  <div>
                    <h3>Equipos funcionando correctamente</h3>
                    <p>
                      {this.state.sensors && this.state.sensors[0].value} sitios
                    </p>
                    <div className="stats">
                      <p>
                        <span>{this.state.ok}%</span> funcionando
                      </p>
                      <p
                        className="border button warning"
                        onClick={() => this.setState({ detail: 'warning' })}>
                        <span>{this.state.war}%</span> alertado
                      </p>
                      <p
                        className="border button error"
                        onClick={() => this.setState({ detail: 'damaged' })}>
                        <span>{this.state.bad}%</span> offline
                      </p>
                    </div>
                  </div>
                </Card>
                {this.props.credentials.company.services.map(
                  item =>
                    item === '06' ? (
                      <Card
                        title="Afluencia de personas"
                        className="horizontal">
                        <div className="info">
                          <div className="data">
                            <h1>
                              {
                                this.state.chartCounter.reduce(
                                  (fElement, sElement) => ({
                                    uv:
                                      parseInt(fElement.uv, 10) +
                                      parseInt(sElement.uv, 10)
                                  })
                                ).uv
                              }{' '}
                              personas{' '}
                              <span className="delta up">
                                {Math.ceil(
                                  this.state.chartCounter.reduce(
                                    (fElement, sElement) => ({
                                      uv:
                                        parseInt(fElement.uv, 10) +
                                        parseInt(sElement.uv, 10)
                                    })
                                  ).uv /
                                    Math.ceil(
                                      this.state.chartCounter.reduce(
                                        (fElement, sElement) => ({
                                          uv:
                                            parseInt(fElement.uv, 10) +
                                            parseInt(sElement.uv, 10)
                                        })
                                      ).uv / 12
                                    )
                                )}%
                              </span>
                            </h1>
                            <p>
                              Promedio:{' '}
                              {Math.ceil(
                                this.state.chartCounter.reduce(
                                  (fElement, sElement) => ({
                                    uv:
                                      parseInt(fElement.uv, 10) +
                                      parseInt(sElement.uv, 10)
                                  })
                                ).uv / 12
                              )}{' '}
                              personas por hora
                            </p>
                          </div>
                          <ul className="leyend">
                            <li className="car">Personas</li>
                          </ul>
                        </div>
                        <ResponsiveContainer width="100%" height={260}>
                          <ComposedChart
                            data={this.state.chartCounter}
                            syncId="dashboard"
                            margin={{
                              top: 20,
                              right: 20,
                              bottom: 20,
                              left: 20
                            }}>
                            <XAxis
                              dataKey="name"
                              height={15}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis width={21} tickLine={false} />
                            <RechartsTooltip
                              isAnimationActive={false}
                              content={Tooltip}
                            />
                            <Bar dataKey="uv" fill="rgba(255,255,255,0.15)" />
                            <Line
                              type="linear"
                              dataKey="uv"
                              stroke={blue}
                              strokeWidth={1}
                              activeDot={{ strokeWidth: 0, fill: blue }}
                              dot={{
                                stroke: blue,
                                strokeWidth: 2,
                                fill: darkGray
                              }}
                            />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </Card>
                    ) : (
                      []
                    )
                )}
              </div>
              <div className="vertical-container">
                <Card className="historical" title="Media de servicio">
                  <ResponsiveContainer width="100%" height={160}>
                    <AreaChart
                      data={dataChart(this.state.chart)}
                      syncId="dashboard"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <XAxis
                        dataKey="name"
                        height={20}
                        mirror
                        axisLine={false}
                        padding={{ right: 50 }}
                      />
                      <CartesianGrid
                        stroke="#424953"
                        horizontal={false}
                        strokeWidth={0.5}
                      />
                      <defs>
                        <linearGradient
                          id="colorUv"
                          x1="1"
                          y1="0"
                          x2="0"
                          y2="0">
                          <stop
                            offset="0%"
                            stopColor={blue}
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="100%"
                            stopColor={blue}
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <RechartsTooltip
                        isAnimationActive={false}
                        content={Tooltip}
                      />
                      <Area
                        dataKey="pv"
                        fill="url(#colorUv)"
                        animationBegin={0}
                        type="natural"
                        stroke={blue}
                        strokeWidth={2}
                        activeDot={{
                          stroke: blue,
                          strokeWidth: 2,
                          fill: darkGray
                        }}
                      />
                      <ReferenceLine
                        y={40}
                        stroke="red"
                        strokeDasharray="5 5"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
                <div className="horizontal-container">
                  <Card title="Zona de mas alertas" className="horizontal">
                    <h1>
                      {this.state.worstZone
                        ? this.state.worstZone.name
                        : 'Ninguna'}
                    </h1>

                    <div className="card-footer">
                      <p className="red">
                        {this.state.worstZone && this.state.worstZone.value}{' '}
                        alertas{' '}
                      </p>
                    </div>
                  </Card>
                  <Card title="Sitio de mas alertas" className="horizontal">
                    <h1>
                      {this.state.worstSite
                        ? this.state.worstSite.name
                        : 'Ninguno'}
                    </h1>
                    <p>Zona Centro</p>
                    <div className="card-footer">
                      <p className="red">
                        {this.state.worstSite
                          ? this.state.worstSite.history.length
                          : 0}{' '}
                        alertas{' '}
                      </p>
                    </div>
                  </Card>
                  <Card title="Top semanal" className="horizontal">
                    <h1>
                      {this.state.weeklyAlerts &&
                      this.state.weeklyAlerts.history.length > 0
                        ? this.state.weeklyAlerts.key
                        : 'Ninguno'}
                    </h1>
                    <p>Zona Centro</p>
                    <div className="card-footer">
                      <p className="red">
                        {this.state.weeklyAlerts
                          ? this.state.weeklyAlerts.history.length
                          : 0}{' '}
                        alertas{' '}
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
            <div className="events-container">
              <Table
                multipleTable
                actionsContainer={
                  <div>
                    <p className="button action disabled">Filtrar</p>
                  </div>
                }
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
                    {item.timestamp && (
                      <div>
                        {new Date(item.timestamp).toLocaleDateString()}{' '}
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </div>
                    )}
                    <div className="medium bold">{item.event}</div>
                    <div className="medium">{item.status}</div>
                    <div>
                      <RiskBar risk={item.risk} />
                    </div>
                    <div>{item.site}</div>
                  </div>
                )}
                elements={[
                  {
                    title: 'Alertas',
                    elements: this.state.alarms
                  },
                  {
                    title: 'Historial',
                    elements: this.state.history
                  }
                ]}
                titles={[
                  { title: 'Tiempo' },
                  { title: 'Suceso', className: 'medium' },
                  { title: 'Estatus', className: 'medium' },
                  { title: 'Riesgo' },
                  { title: 'Sitio' }
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Dashboard.propTypes = {
  credentials: PropTypes.object,
  reports: PropTypes.array
}

function mapStateToProps(props) {
  const { reports, credentials } = props
  return {
    reports,
    credentials
  }
}

export default connect(mapStateToProps)(Dashboard)
