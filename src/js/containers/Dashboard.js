import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PieChart, Pie, Cell, AreaChart, XAxis, CartesianGrid, Tooltip, ReferenceLine, Area } from 'recharts'

import { green, yellow, red, blue } from '../lib/colors'

const data = [
  { name: 'workings', value: 96.1 },
  { name: 'alerts', value: 2.8 },
  { name: 'damaged', value: 1.1 }
]

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
    case 'working': return green
    case 'alerts': return yellow
    case 'damaged': return red
    default: return green
  }
}

class Dashboard extends Component {
  render() {
    const { state, props } = this

    return (
      <div className="dashboard app-content">
        <div className="overall-container">
          <div className="graph-container">
            <div className="graph">
              <PieChart width={170} height={170}>
                <Pie
                  animationBegin={0}
                  data={data}
                  cx={80}
                  cy={80}
                  outerRadius={80}
                  fill="#8884d8"
                  stroke="#1D2229"
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
          </div>
          <div className="historical">
            <AreaChart width={500} height={150} data={barData}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
             <XAxis dataKey="name" height={20} />
             <CartesianGrid stroke="#424953" strokeDasharray="3 3" horizontal={false} />
             <Tooltip/>
             <defs>
              <linearGradient id="colorUv" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor={blue} stopOpacity={0.8}/>
                <stop offset="100%" stopColor={blue} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
             <Area dataKey="pv" fill="url(#colorUv)" animationBegin={0} type="monotone" stroke={green}/>
             <ReferenceLine y={40} stroke="red" strokeDasharray="3 3" />
           </AreaChart>
          </div>
        </div>
        <div className="content">
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
    )
  }
}

Dashboard.propTypes = {

}

export default Dashboard
