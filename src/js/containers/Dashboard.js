import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { PieChart, Pie, Cell, AreaChart, XAxis, LineChart, CartesianGrid, Tooltip as RechartsTooltip, ReferenceLine, Area, ResponsiveContainer,ComposedChart, YAxis, Bar, Line } from 'recharts'

import { Card, Table, DateRangePicker, RiskBar, Tooltip } from '../components'
import { yellow, red, blue, darkGray, violet } from '../lib/colors'

const data = [
  { name: 'workings', value: 100 },
  { name: 'alerts', value: 0 },
  { name: 'damaged', value: 0 }
]

const data2 = [
  { name: '7:00 AM', uv: 2, pv: 1042, tv: 92 },
  { name: '8:00 AM', uv: 6, pv: 1042, tv: 34 },
  { name: '9:00 AM', uv: 24, pv: 1043, tv: 93 },
  { name: '10:00 AM', uv: 7, pv: 940, tv: 40 },
  { name: '11:00 AM', uv: 8, pv: 1241, tv: 541 },
  { name: '12:00 PM', uv: 4, pv: 1043, tv: 53 },
  { name: '1:00 PM', uv: 6, pv: 1204, tv: 14 },
  { name: '2:00 PM', uv: 8, pv: 1143, tv: 443 },
  { name: '3:00 PM', uv: 9, pv: 1443, tv: 263 },
  { name: '4:00 PM', uv: 3, pv: 1143, tv: 583 },
  { name: '5:00 PM', uv: 6, pv: 1143, tv: 583 },
  { name: '6:00 PM', uv: 18, pv: 1042, tv: 43 },
  { name: '7:00 PM', uv: 11, pv: 1042, tv: 51 }
]

const barData = [
      {name: '7:00 AM', pv: 100 },
      {name: '8:00 AM', pv: 100 },
      {name: '9:00 AM', pv: 100 },
      {name: '10:00 AM', pv: 100 },
      {name: '11:00 AM', pv: 100 },
      {name: '12:00 PM', pv: 100 },
      {name: '1:00 AM', pv: 100 },
      {name: '2:00 AM', pv: 100 },
      {name: '3:00 AM', pv: 100 },
      {name: '4:00 AM', pv: 100 },
      {name: '5:00 AM', pv: 100 },
      {name: '6:00 PM', pv: 100 },
      {name: '7:00 PM', pv: 100 }
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
      to: new Date(),
      detail: null
    }
  }

  render() {
    const { state, props } = this
    const { facialReports, accessReports, cameraReports, perimeterReports, vehicularReports } = props
    const reports = facialReports
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
            <div className={`horizontal-container ${state.detail !== null ? 'minified' : ''}`}>
              <div className="vertical-container">
                <Card
                  className={`graph-container`}
                  full={state.detail === 'performance'}
                  detailView={
                    <div className="detail-view">
                      <h1>4<p>/300 equipos dañados (<span>1.2%</span>)</p></h1>
                      <Table
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
                            <div>{item.risk}</div>
                          </div>
                        }
                        elements={[
                          { title: 'Dañados', elements: []},
                          { title: 'Alertados', elements: []}
                        ]}
                        titles={[
                          {title: 'Tiempo' },
                          {title: 'Sitio', className: 'medium'},
                          {title: 'Zona', className: 'medium'},
                          {title: 'Suceso'},
                          {title: 'Estatus'},
                          {title: 'Riesgo'}
                        ]}
                      />
                    </div>
                  }
                  detailActions={
                    <p onClick={() => this.setState({detail: null})}>Cerrar</p>
                  }
                  title="Rendimiento general">
                  <div className="graph">
                    <PieChart width={200} height={200}>
                      <Pie
                        animationBegin={0} dataKey="value" data={data}
                        cx={95} cy={95} innerRadius={60} outerRadius={95}
                        strokeWidth={0} label>
                        {
                          data.map(({name}, index) =>
                            <Cell key={index} fill={getColor(name)}/>
                          )
                        }
                      </Pie>
                      <RechartsTooltip isAnimationActive={false} content={Tooltip} />
                    </PieChart>
                    <h1>100%</h1>
                    <p>2 sitios</p>
                  </div>
                  <div>
                    <h3>Equipos funcionando correctamente</h3>
                    <p>2 sitios</p>
                    <div className="stats">
                      <p><span>100%</span> funcionando</p>
                      <p className="border button warning" onClick={() => this.setState({detail: 'performance'})}><span>0%</span> alertado</p>
                      <p className="border button error" onClick={() => this.setState({detail: 'performance'})}><span>0%</span> dañado</p>
                    </div>
                  </div>
                </Card>
                <Card title="Afluencia de personas" className="horizontal">
                  <div className="info">
                    <div className="data">
                      <h1>25 <span className="delta up">15%</span></h1>
                      <p>4 personas por hora</p>
                    </div>
                    <ul className="leyend">
                      <li className="car">Personas</li>
                    </ul>
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
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
              </div>
              <div className="vertical-container">
                <Card className="historical" title="Media de servicio">
                  <ResponsiveContainer width="100%" height={160}>
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
                    <h1>Centro</h1>
                    <p>2 Sitios</p>
                    <div className="card-footer">
                      <p className="red">1 alerta</p>
                      <span className="action">Revisar</span>
                    </div>
                  </Card>
                  <Card
                    title="Sitio de mas alertas"
                    className="horizontal"
                  >
                    <h1>CNHQ9094</h1>
                    <p>Zona Centro</p>
                    <div className="card-footer">
                      <p className="red">21 alertas</p>
                      <span className="action">Revisar</span>
                    </div>
                  </Card>
                </div>

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
                      <div>{item.timestamp.toString()}</div>
                    }
                    <div className="medium bold">{item.event}</div>
                    <div className="medium">{item.status}</div>
                    <div><RiskBar risk={item.risk} /></div>
                    <div>{item.site}</div>
                  </div>
                }
                elements={[
                  { title: 'Historial', elements: reports},
                  { title: 'Alertas', elements: reports.filter($0 => $0.risk > 0)}
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
  return {facialReports}
}

export default connect(mapStateToProps)(Dashboard)
