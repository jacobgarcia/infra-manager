import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PieChart, Pie, Cell, AreaChart, XAxis, CartesianGrid, Tooltip, ReferenceLine, Area, ResponsiveContainer,ComposedChart, YAxis, Bar, Line } from 'recharts'

import { Card } from '../components'
import { yellow, red, blue, darkGray } from '../lib/colors'

const data = [
  { name: 'workings', value: 96.1 },
  { name: 'alerts', value: 2.8 },
  { name: 'damaged', value: 1.1 }
]

const data2 = [{ name: '1:00 AM', uv: 590 },
              { name: '2:00 AM', uv: 868 },
              { name: '3:00 AM', uv: 1397 },
              { name: '4:00 AM', uv: 1480 },
              { name: '5:00 AM', uv: 1520 },
              { name: '6:00 AM', uv: 1400 },
              { name: '7:00 AM', uv: 1400 },
              { name: '8:00 AM', uv: 1400 },
              { name: '9:00 AM', uv: 1400 }]

const barData = [
      {name: '0:00 AM', pv: 76 },
      {name: '0:00 AM', pv: 88 },
      {name: '0:00 AM', pv: 90 },
      {name: '0:00 AM', pv: 78 },
      {name: '0:00 AM', pv: 58 },
      {name: '0:00 AM', pv: 67 },
      {name: '0:00 AM', pv: 74 }
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
      selected: 0
    }
  }
  render() {
    const { state, props } = this

    return (
      <div className="dashboard app-content">
        <div className="overall-container">
          <div className="horizontal-container">
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
                  >
                    {
                      data.map(({name}, index) =>
                        <Cell key={index} fill={getColor(name)}/>
                      )
                    }
                  </Pie>
                </PieChart>
              </div>
              <div>
                <h3>Rendimiento general del equipo</h3>
                <p>120 sitios</p>
                <div className="stats">
                  <p><span>96.1%</span> funcionando</p>
                  <p><span>2.8%</span> alertado</p>
                  <p><span>1.1%</span> dañado</p>
                </div>
              </div>
            </Card>
            <Card className="historical" title="Media de servicio">
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={barData}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                 <XAxis dataKey="name" height={20} mirror axisLine={false} padding={{right: 50}}/>
                 <CartesianGrid stroke="#424953" horizontal={false} strokeWidth={0.5} />
                 <Tooltip/>
                 <defs>
                  <linearGradient id="colorUv" x1="1" y1="0" x2="0" y2="0">
                    <stop offset="0%" stopColor={blue} stopOpacity={0.8}/>
                    <stop offset="100%" stopColor={blue} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                 <Area dataKey="pv" fill="url(#colorUv)" animationBegin={0} type="natural" stroke={blue} strokeWidth={2}
                   activeDot={{ stroke: blue, strokeWidth: 2, fill: darkGray }} />
                 <ReferenceLine y={40} stroke="red" strokeDasharray="5 5" />
               </AreaChart>
             </ResponsiveContainer>
            </Card>
          </div>
          <div className="horizontal-container">
            <Card title="Afluencia de personas" className="horizontal">
              <div>
                <h1>105</h1>
                <p>7 personas por hora</p>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <ComposedChart data={data2}
                      margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                    <XAxis dataKey="name" height={15} axisLine={false} tickLine={false} />
                    <YAxis width={15} tickLine={false} />
                    <Tooltip/>
                    <Bar dataKey="uv" barSize={30} fill="rgba(255,255,255,0.15)"/>
                    <Line type="linear" dataKey="uv" stroke={blue}
                      strokeWidth={0.5}
                      dot={{ strokeWidth: 0, fill: blue }}
                      activeDot={{ stroke: blue, strokeWidth: 2, fill: darkGray }} />
                 </ComposedChart>
               </ResponsiveContainer>
            </Card>
            <Card title="Flujo vehicular" className="horizontal">
              <div>
                <h1>210</h1>
                <p>15 vehículos por hora</p>
              </div>
            </Card>
          </div>
          <div className="events-container">
            <ul className="inline-nav">
              <li className={state.selected ? '' : 'active'} onClick={() => this.setState({ selected: 0 })}>Historial de sucesos</li>
              <li className={state.selected ? 'active' : ''} onClick={() => this.setState({ selected: 1 })}>Alertas</li>
            </ul>
            <div className="table">
              <div className="table-header">
                <div className="table-item">
                  <div className="medium">Tiempo</div>
                  <div className="large">Suceso</div>
                  <div>Zona</div>
                  <div>Sitio</div>
                  <div>Riesgo</div>
                  <div className="medium">Acción</div>
                </div>
              </div>
              <div className="table-body">
                {
                  state.selected
                  ?
                  [0,0,0,0,0].map((element, index) =>
                    <div className="table-item" key={index}>
                      <div className="medium">3 enero <span>7:45 AM</span></div>
                      <div className="large">Detección de movimiento</div>
                      <div>Norte</div>
                      <div>45</div>
                      <div>III</div>
                      <div className="medium">Vigilancia</div>
                    </div>
                  )
                  :
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0].map((element, index) =>
                    <div className="table-item" key={index}>
                      <div className="medium">3 enero <span>7:45 AM</span></div>
                      <div className="large">Detección de movimiento</div>
                      <div>Norte</div>
                      <div>45</div>
                      <div>{index % 3}</div>
                      <div className="medium">Vigilancia</div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Dashboard.propTypes = {

}

export default Dashboard
