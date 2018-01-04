import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PieChart, Pie, Cell, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts'

import { green, yellow, red } from '../lib/colors'

const data = [
  { name: 'workings', value: 96.1 },
  { name: 'alerts', value: 2.8 },
  { name: 'damaged', value: 1.1 }
]

const barData = [
      {name: 'Page A', uv: 40, pv: 20, amt: 40},
      {name: 'Page B', uv: 30, pv: 18, amt: 20},
      {name: 'Page C', uv: 20, pv: 90, amt: 20},
      {name: 'Page D', uv: 28, pv: 38, amt: 94},
      {name: 'Page E', uv: 19, pv: 40, amt: 11},
      {name: 'Page F', uv: 29, pv: 30, amt: 50},
      {name: 'Page G', uv: 39, pv: 40, amt: 10},
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
  constructor(props) {
    super(props)

    this.state = {

    }
  }

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
            <BarChart width={500} height={150} data={barData}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
             <XAxis dataKey="name" height={20} />
             <YAxis width={20}/>
             <CartesianGrid stroke="#424953"/>
             <Tooltip/>
             <Bar dataKey="pv" fill={red} animationBegin={0} />
             <Bar dataKey="amt" fill={yellow} animationBegin={0} />
             <Bar dataKey="uv" fill={green} animationBegin={0} />
            </BarChart>
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
                [0,0,0,0,0,0].map((element, index) =>
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
