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

import { Card, Table, RiskBar, Tooltip } from '../components'
import { blue, darkGray } from '../lib/colors'
import {
  getColor,
  itemStatus,
  pvAtTime,
  dataChart
} from '../lib/specialFunctions'
import { NetworkOperation } from '../lib'

const data = [
  { name: 'workings', value: 75 },
  { name: 'alerts', value: 15 },
  { name: 'damaged', value: 10 }
]

const data2 = [
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
  { name: '7:00 PM', uv: 13, pv: 1042, tv: 51 }
]

class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: 0,
      logs: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      alerts: [],
      selectedElementIndex: [null, null],
      from: new Date(),
      to: new Date(),
      detail: null
    }
  }
  componentWillMount() {

    NetworkOperation.getSensors().then(({ data }) => {
      const csStatus = itemStatus('cs', data.sensors, 'upscale', 80, 20)
      const vsStatus = itemStatus('vs', data.sensors, 'upscale', 80, 20)
      const tempData = [
        {
          name: 'workings',
          value:
            csStatus[0].value < vsStatus[0].value
              ? csStatus[0].value
              : vsStatus[0].value
        },
        {
          name: 'alerts',
          value:
            csStatus[1].value < vsStatus[1].value
              ? vsStatus[1].value
              : csStatus[1].value
        },
        {
          name: 'damaged',
          value:
            csStatus[2].value < vsStatus[2].value
              ? vsStatus[2].value
              : csStatus[2].value
        }
      ]
      const okPercent = parseInt(
        tempData[0].value /
          (tempData[0].value + tempData[1].value + tempData[2].value) *
          100
      )
      const warPercent = parseInt(
        tempData[1].value /
          (tempData[0].value + tempData[1].value + tempData[2].value) *
          100
      )
      const badPercent = parseInt(
        tempData[2].value /
          (tempData[0].value + tempData[1].value + tempData[2].value) *
          100
      )

      this.setState({
        sensors: tempData,
        ok: okPercent,
        war: warPercent,
        bad: badPercent
      })
    })
    NetworkOperation.getHistory().then(({ data }) => {
      const ranking = []
      const history = []
      data.sites.map(site => {
        // pushing for ranking
        ranking.push(site.history.length)
        // pushiw each log into history
        site.history.map(log => {
          history.push(new Date(log.timestamp))
        })
      })
      history.map(time => {
        const current = new Date(time.timestamp)
      })
      this.setState({
        chart: history,
        worst: data.sites[ranking.indexOf(Math.max(...ranking))]
      })
      data.sites[ranking.indexOf(Math.max(...ranking))].history.length
      data.sites[ranking.indexOf(Math.max(...ranking))].key
      data.sites[ranking.indexOf(Math.max.apply(Math,ranking))].history.length
      data.sites[ranking.indexOf(Math.max.apply(Math,ranking))].key

    })
  }
  render() {
    const now = new Date()

    const { state, props } = this
    const {
      facialReports,
      accessReports,
      cameraReports,
      perimeterReports,
      vehicularReports
    } = props
    const reports = facialReports
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
                  full={state.detail === 'performance'}
                  detailView={
                    <div className="detail-view">
                      <h1>
                        1<p>
                          /8 equipos dañados (<span>10%</span>)
                        </p>
                      </h1>
                      <Table
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
                                {item.timestamp.toLocaleDateString('es-MX')}{' '}
                                {item.timestamp.toLocaleTimeString('es-MX')}
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
                          { title: 'Dañados', elements: [] },
                          { title: 'Alertados', elements: [] }
                        ]}
                        titles={[
                          { title: 'Tiempo' },
                          { title: 'Sitio', className: 'medium' },
                          { title: 'Zona', className: 'medium' },
                          { title: 'Suceso' },
                          { title: 'Estatus' },
                          { title: 'Riesgo' }
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
                        {data.map(({ name }, index) => (
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
                        onClick={() =>
                          this.setState({ detail: 'performance' })
                        }>
                        <span>{this.state.war}%</span> alertado
                      </p>
                      <p
                        className="border button error"
                        onClick={() =>
                          this.setState({ detail: 'performance' })
                        }>
                        <span>{this.state.bad}%</span> dañado
                      </p>
                    </div>
                  </div>
                </Card>
                <Card title="Afluencia de personas" className="horizontal">
                  <div className="info">
                    <div className="data">
                      <h1>
                        192 <span className="delta up">15%</span>
                      </h1>
                      <p>13 personas por hora</p>
                    </div>
                    <ul className="leyend">
                      <li className="car">Personas</li>
                    </ul>
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <ComposedChart
                      data={data2}
                      syncId="dashboard"
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
                        dot={{ stroke: blue, strokeWidth: 2, fill: darkGray }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </Card>
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
                    <h1>Centro</h1>
                    <p>18 Sitios</p>
                    <div className="card-footer">
                      <p className="red">8 alertas </p>
                    </div>
                  </Card>
                  <Card title="Sitio de mas alertas" className="horizontal">
                    <h1>{this.state.worst && this.state.worst.key}</h1>
                    <p>Zona Centro</p>
                    <div className="card-footer">
                      <p className="red">
                        {this.state.worst && this.state.worst.history.length}{' '}
                        alertas
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
                    {item.timestamp && <div>{item.timestamp.toString()}</div>}
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
                    title: 'Historial',
                    elements: perimeterReports.concat(reports)
                  },
                  {
                    title: 'Alertas',
                    elements: reports.filter($0 => $0.risk > 0)
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

Dashboard.propTypes = {}

function mapStateToProps({
  facialReports,
  // accessReports,
  // cameraReports,
  perimeterReports
  // vehicularReports
}) {
  return { facialReports, perimeterReports }
}

export default connect(mapStateToProps)(Dashboard)
