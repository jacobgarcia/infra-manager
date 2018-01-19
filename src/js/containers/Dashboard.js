import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { PieChart, Pie, Cell, AreaChart, XAxis, LineChart, CartesianGrid, Tooltip as RechartsTooltip, ReferenceLine, Area, ResponsiveContainer,ComposedChart, YAxis, Bar, Line } from 'recharts'

import { Card, Table, DateRangePicker, RiskBar } from '../components'
import { yellow, red, blue, darkGray, violet } from '../lib/colors'

const Tooltip = ({payload, label}) => (
  <div className="tooltip">
    <span>{label}</span>
    {
      payload &&
      payload.map((element, index) =>
        <div key={index}>
          <span className="icon" style={{backgroundColor: element.color}} />
          <p>{element.name}: {element.value}</p>
        </div>
      )
    }
  </div>
)

const data = [
  { name: 'workings', value: 96.1 },
  { name: 'alerts', value: 2.8 },
  { name: 'damaged', value: 1.1 }
]

const data2 = [
  { name: '1:00 AM', uv: 590, pv: 1043, tv: 93 },
  { name: '2:00 AM', uv: 868, pv: 940, tv: 40 },
  { name: '3:00 AM', uv: 1397, pv: 1241, tv: 541 },
  { name: '4:00 AM', uv: 1480, pv: 1043, tv: 53 },
  { name: '5:00 AM', uv: 1520, pv: 1204, tv: 14 },
  { name: '6:00 AM', uv: 1400, pv: 1143, tv: 443 },
  { name: '7:00 AM', uv: 1400, pv: 1443, tv: 263 },
  { name: '8:00 AM', uv: 1400, pv: 1143, tv: 583 },
  { name: '9:00 AM', uv: 1400, pv: 1143, tv: 583 },
  { name: '10:00 AM', uv: 400, pv: 1042, tv: 34 },
  { name: '11:00 AM', uv: 1100, pv: 1042, tv: 92 },
  { name: '12:00 PM', uv: 1300, pv: 1042, tv: 43 },
  { name: '1:00 PM', uv: 2400, pv: 1042, tv: 51 }
]

const barData = [
      {name: '1:00 AM', pv: 88 },
      {name: '2:00 AM', pv: 90 },
      {name: '3:00 AM', pv: 78 },
      {name: '4:00 AM', pv: 58 },
      {name: '5:00 AM', pv: 67 },
      {name: '6:00 AM', pv: 74 },
      {name: '7:00 AM', pv: 74 },
      {name: '8:00 AM', pv: 79 },
      {name: '9:00 AM', pv: 80 },
      {name: '10:00 AM', pv: 83 },
      {name: '11:00 AM', pv: 84 },
      {name: '12:00 PM', pv: 85 },
      {name: '1:00 PM', pv: 80 }
]

function getColor(name) {
  switch (name) {
    case 'working': return blue
    case 'alerts': return yellow
    case 'damaged': return red
    default: return blue
  }
}

class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: 0,
      logs: [0,0,0,0,0,0,0,0,0],
      alerts: [],
      selectedElementIndex: [null, null],
      from: new Date(),
      to: new Date()
    }
  }
  render() {
    const { state, props } = this
    const { facialReports, accessReports, cameraReports, perimeterReports, vehicularReports } = props
    const reports = facialReports.concat(accessReports).concat(cameraReports).concat(perimeterReports).concat(vehicularReports)

    return (
      <div className="dashboard app-content small-padding">
        <div className="content">
          <h2>Estatus <div className="actions">
            <DateRangePicker
              from={state.from}
              to={state.to}
              onDayClick={this.onDayClick}
            />
          </div></h2>
          <div className="overall-container">
            <div className="horizontal-container">
              <div className="vertical-container">
                <Card className="graph-container" title="Rendimiento general">
                  <div className="graph">
                    <PieChart width={200} height={200}>
                      <Pie
                        animationBegin={0}
                        dataKey="value"
                        data={data}
                        cx={95} cy={95}
                        innerRadius={60}
                        outerRadius={95}
                        strokeWidth={0}
                        label
                      >
                        {
                          data.map(({name}, index) =>
                            <Cell key={index} fill={getColor(name)}/>
                          )
                        }
                      </Pie>
                      <RechartsTooltip isAnimationActive={false} content={Tooltip} />
                    </PieChart>
                    <h1>96.1%</h1>
                  </div>
                  <div>
                    <h3>Equipos funcionando correctamente</h3>
                    <p>120 sitios</p>
                    <div className="stats">
                      <p><span>96.1%</span> funcionando</p>
                      <p className="border button warning"><span>2.8%</span> alertado</p>
                      <p className="border button error"><span>1.1%</span> dañado</p>
                    </div>
                  </div>
                </Card>
                <Card className="historical" title="Media de servicio">
                  <ResponsiveContainer width="100%" height={190}>
                    <AreaChart data={barData}
                      syncId="dashboard"
                      margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                       <XAxis dataKey="name" height={20} mirror axisLine={false} padding={{right: 50}}/>
                       <CartesianGrid stroke="#424953" horizontal={false} strokeWidth={0.5} />
                       <defs>
                        <linearGradient id="colorUv" x1="1" y1="0" x2="0" y2="0">
                          <stop offset="0%" stopColor={blue} stopOpacity={0.8}/>
                          <stop offset="100%" stopColor={blue} stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <RechartsTooltip isAnimationActive={false} content={Tooltip} />
                       <Area dataKey="pv" fill="url(#colorUv)" animationBegin={0}
                         type="natural" stroke={blue} strokeWidth={2}
                         activeDot={{ stroke: blue, strokeWidth: 2, fill: darkGray }} />
                     <ReferenceLine y={40} stroke="red" strokeDasharray="5 5" />
                   </AreaChart>
                 </ResponsiveContainer>
                </Card>
                <div className="horizontal-container">
                  <Card
                    title="Zona de mas alertas"
                    className="horizontal"
                  >
                    <h1>54</h1>
                    <p>Zona Centro</p>
                    <div className="card-footer">
                      <p className="red">21 alertas</p>
                      <span className="action">Revisar</span>
                    </div>
                  </Card>
                  <Card
                    title="Sitio de mas alertas"
                    className="horizontal"
                  >
                    <h1>Norte</h1>
                    <p>98 Sitios</p>
                    <div className="card-footer">
                      <p className="red">21 alertas</p>
                      <span className="action">Revisar</span>
                    </div>
                  </Card>
                </div>
              </div>
              <div className="vertical-container">
                <Card title="Afluencia de personas" className="horizontal">
                  <div>
                    <h1>105</h1>
                    <p>7 personas por hora</p>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <ComposedChart data={data2}
                          syncId="dashboard"
                          margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                        <XAxis dataKey="name" height={15} axisLine={false} tickLine={false} />
                        <YAxis width={21} tickLine={false} />
                        <RechartsTooltip isAnimationActive={false} content={Tooltip} />
                        <Bar dataKey="uv" fill="rgba(255,255,255,0.15)"/>
                        <Line type="linear" dataKey="uv" stroke={blue}
                          strokeWidth={1}
                          activeDot={{ strokeWidth: 0, fill: blue }}
                          dot={{ stroke: blue, strokeWidth: 2, fill: darkGray }} />
                     </ComposedChart>
                   </ResponsiveContainer>
                </Card>
                <Card title="Flujo vehicular" className="horizontal">
                  <div>
                    <h1>210</h1>
                    <p>15 vehículos por hora</p>
                  </div>
                  <ResponsiveContainer width="100%" height={190}>
                    <LineChart data={data2}
                          syncId="dashboard"
                          margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                        <XAxis dataKey="name" height={15} axisLine={false} tickLine={false} />
                        <YAxis width={21} tickLine={false} />
                        <RechartsTooltip isAnimationActive={false} content={Tooltip} />
                        <Line type="linear" dataKey="uv" stroke={blue}
                          strokeWidth={1}
                          activeDot={{ strokeWidth: 0, fill: blue }}
                          dot={{ stroke: blue, strokeWidth: 2, fill: darkGray }} />
                        <Line type="linear" dataKey="pv" stroke={yellow}
                          strokeWidth={1}
                          activeDot={{ strokeWidth: 0, fill: yellow }}
                          dot={{ stroke: yellow, strokeWidth: 2, fill: darkGray }} />
                        <Line type="linear" dataKey="tv" stroke={violet}
                          strokeWidth={1}
                          activeDot={{ strokeWidth: 0, fill: violet }}
                          dot={{ stroke: violet, strokeWidth: 2, fill: darkGray }} />
                     </LineChart>
                   </ResponsiveContainer>
                </Card>
              </div>
            </div>
            <div className="events-container">
              <Table
                actionsContainer={
                  <div>
                    <p className="button action disabled">Filtrar</p>
                  </div>
                }
                selectedElementIndex={state.selectedElementIndex}
                element={(item, index, sectionIndex) =>
                  <div className={`table-item ${state.selectedElementIndex[0] === index && state.selectedElementIndex[1] === sectionIndex ? 'selected' : ''}`}
                    key={index}
                    onClick={() => this.onLogSelect(item, index, sectionIndex)}>
                    {
                      item.timestamp &&
                      <div>{item.timestamp.toLocaleDateString('es-MX')} {item.timestamp.toLocaleTimeString('es-MX')}</div>
                    }
                    <div className="medium bold">{item.event}</div>
                    <div className="medium">{item.status}</div>
                    <div><RiskBar risk={item.risk} /></div>
                    <div>{item.site}</div>
                  </div>
                }
                elements={[
                  { title: 'Historial', elements: reports},
                  { title: 'Alertas', elements: state.alerts}
                ]}
                titles={[
                  {title: 'Tiempo' },
                  {title: 'Suceso', className: 'medium'},
                  {title: 'Estatus', className: 'medium'},
                  {title: 'Riesgo'},
                  {title: 'Sitio'}
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

}

function mapStateToProps({facialReports, accessReports, cameraReports, perimeterReports, vehicularReports}) {
  return {facialReports, accessReports, cameraReports, perimeterReports, vehicularReports}
}

export default connect(mapStateToProps)(Dashboard)
