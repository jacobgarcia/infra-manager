import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts'
import { Card, Tooltip, BatteryChart, FuelChart } from '../components'
import { NetworkOperation } from '../lib'
import { getColor } from '../lib/specialFunctions'

const data = [
  { name: 'workings', value: 100 },
  { name: 'alerts', value: 0 },
  { name: 'damaged', value: 0 }
]

const data2 = [
  { name: 'workings', value: 175 },
  { name: 'alerts', value: 17 },
  { name: 'damaged', value: 3 }
]

const data3 = [
  { name: 'workings', value: 17 },
  { name: 'alerts', value: 2 },
  { name: 'damaged', value: 4 }
]

class Users extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users: [],
      isAddingUser: false,
      query: '',
      filteredUsers: [],
      alerts: [],
      latestAlerts: [],
      from: new Date(),
      to: new Date()
    }

    this.onSites = this.onSites.bind(this)
  }

  onSites() {
    this.props.history.replace(`/sites`)
  }

  componentDidMount() {
    NetworkOperation.getInventory().then(({ data }) => {
      data.sites.map(site => {
        site.sensors.map(sensor => {
          console.log(sensor)
        })
      })
    })
  }

  render() {
    const { state, props } = this

    return (
      <div className="users app-content small-padding sensors">
        <Helmet>
          <title>Connus | Sensores</title>
        </Helmet>
        <div className="content">
          <h2>Estatus</h2>
          <div className="overall-container">
            <div className="horizontal-container">
              <Card title="Temperatura" className={`graph-container`}>
                <div className="graph">
                  <PieChart width={160} height={160}>
                    <Pie
                      animationBegin={0}
                      dataKey="value"
                      data={data}
                      cx={75}
                      cy={75}
                      innerRadius={55}
                      outerRadius={75}
                      strokeWidth={0}
                      label
                    >
                      {data.map(({ name }, index) => (
                        <Cell key={index} fill={getColor(name)} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      isAnimationActive={false}
                      content={Tooltip}
                    />
                  </PieChart>
                  <h1>22º</h1>
                </div>
                <div className="center">
                  Ningún Sitio Dañado
                  <p className="border button" onClick={this.onSites}>
                    8 sitios
                  </p>
                </div>
              </Card>
              <Card title="Vibración" className={`graph-container`}>
                <div className="graph">
                  <PieChart width={160} height={160}>
                    <Pie
                      animationBegin={0}
                      dataKey="value"
                      data={data3}
                      cx={75}
                      cy={75}
                      innerRadius={55}
                      outerRadius={75}
                      strokeWidth={0}
                      label
                    >
                      {data.map(({ name }, index) => (
                        <Cell key={index} fill={getColor(name)} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      isAnimationActive={false}
                      content={Tooltip}
                    />
                  </PieChart>
                  <h1>17</h1>
                </div>
                <div className="center">
                  Activaciones
                  <p className="border button" onClick={this.onSites}>
                    8 sitios
                  </p>
                </div>
              </Card>
              <Card title="Apertura" className={`graph-container`}>
                <div className="graph">
                  <PieChart width={160} height={160}>
                    <Pie
                      animationBegin={0}
                      dataKey="value"
                      data={data2}
                      cx={75}
                      cy={75}
                      innerRadius={55}
                      outerRadius={75}
                      strokeWidth={0}
                      label
                    >
                      {data.map(({ name }, index) => (
                        <Cell key={index} fill={getColor(name)} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      isAnimationActive={false}
                      content={Tooltip}
                    />
                  </PieChart>
                  <h1>192</h1>
                </div>
                <div className="center">
                  Accesos
                  <p className="border button" onClick={this.onSites}>
                    8 sitios
                  </p>
                </div>
              </Card>
              <Card title="Voltaje" className={`graph-container`}>
                <div className="graph">
                  <PieChart width={160} height={160}>
                    <Pie
                      animationBegin={0}
                      dataKey="value"
                      data={data}
                      cx={75}
                      cy={75}
                      innerRadius={55}
                      outerRadius={75}
                      strokeWidth={0}
                      label
                    >
                      {data.map(({ name }, index) => (
                        <Cell key={index} fill={getColor(name)} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      isAnimationActive={false}
                      content={Tooltip}
                    />
                  </PieChart>
                  <h1>5.5 A</h1>
                </div>
                <div className="center">
                  Ningún Sitio Dañado
                  <p className="border button" onClick={this.onSites}>
                    8 sitios
                  </p>
                </div>
              </Card>
              <Card title="Nivel de Batería">
                <div>
                  <BatteryChart height={160} width={110} />
                </div>
                <div className="center">
                  <h3>90% promedio</h3>

                  <p>Ningún sitio alertado</p>
                  <p className="border button" onClick={this.onSites}>
                    8 Sitios
                  </p>
                </div>
              </Card>
              <Card title="Nivel de Combustible">
                <div>
                  <FuelChart height={160} width={110} percentage={80} />
                </div>
                <div className="center">
                  <h3>80% promedio</h3>
                  <p>1 alertado</p>
                  <p className="border warning button" onClick={this.onSites}>
                    1 Sitio
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ zones, credentials }) {
  return {
    zones,
    credentials
  }
}

Users.propTypes = {
  credentials: PropTypes.object
}

export default connect(mapStateToProps)(Users)
