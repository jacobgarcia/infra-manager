import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PieChart, Pie, Cell, AreaChart, XAxis, CartesianGrid, Tooltip, ReferenceLine, Area, ResponsiveContainer,ComposedChart, YAxis, Bar, Line } from 'recharts'

import { Card } from '../components'
import { yellow, red, blue } from '../lib/colors'

const data = [
  { name: 'workings', value: 96.1 },
  { name: 'alerts', value: 2.8 },
  { name: 'damaged', value: 1.1 }
]

const data2 = [{name: 'Page A', uv: 590, pv: 800, amt: 1400},
              {name: 'Page B', uv: 868, pv: 967, amt: 1506},
              {name: 'Page C', uv: 1397, pv: 1098, amt: 989},
              {name: 'Page D', uv: 1480, pv: 1200, amt: 1228},
              {name: 'Page E', uv: 1520, pv: 1108, amt: 1100},
              {name: 'Page F', uv: 1400, pv: 680, amt: 1700}]

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
            <Card className="historical horizontal" title="Media de servicio">
              <div>
                <h1>98%</h1>
                <h3>12</h3>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={barData}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                 <XAxis dataKey="name" height={20} mirror axisLine={false} padding={{right: 50}}/>
                 <CartesianGrid stroke="#424953" strokeDasharray="5 5" horizontal={false} />
                 <Tooltip/>
                 <defs>
                  <linearGradient id="colorUv" x1="1" y1="0" x2="0" y2="0">
                    <stop offset="0%" stopColor={blue} stopOpacity={0.8}/>
                    <stop offset="100%" stopColor={blue} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                 <Area dataKey="pv" fill="url(#colorUv)" animationBegin={0} type="natural" stroke={blue} strokeWidth={2}/>
                 <ReferenceLine y={40} stroke="red" strokeDasharray="5 5" />
               </AreaChart>
             </ResponsiveContainer>
            </Card>
          </div>
          <div className="horizontal-container">
            <Card title="Afluencia de personas">
              <ComposedChart width={600} height={400} data={data2}
                    margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                  <XAxis dataKey="name"/>
                  <YAxis />
                  <Tooltip/>
                  <CartesianGrid stroke='#f5f5f5'/>
                  <Bar dataKey='uv' barSize={20} fill='#413ea0'/>
                  <Line type='monotone' dataKey='uv' stroke='#ff7300'/>
               </ComposedChart>
            </Card>
            <Card title="Flujo vehicular">

            </Card>
          </div>
          <div className="events-container">
            <ul className="inline-nav">
              <li className="active">Historial de sucesos</li>
              <li>Alertas</li>
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
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0].map((element, index) =>
                    <div className="table-item" key={index}>
                      <div className="medium">3 enero <span>7:45 AM</span></div>
                      <div className="large">Detección de movimiento</div>
                      <div>Norte</div>
                      <div>45</div>
                      <div>III</div>
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
