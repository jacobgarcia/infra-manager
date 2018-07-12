import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { PieChart, Pie, Cell } from 'recharts'
import io from 'socket.io-client'

import { Card, FuelChart } from 'components'
import { NetworkOperation } from 'lib'
import { getColor } from 'lib/specialFunctions'

const data = [
  { name: 'workings', value: 100 },
  { name: 'alerts', value: 0 },
  { name: 'damaged', value: 0 }
]

class Devices extends Component {
  static propTypes = {
    credentials: PropTypes.object,
    history: PropTypes.object
  }

  state = {
    users: [],
    isAddingUser: false,
    query: '',
    filteredUsers: [],
    alerts: [],
    latestAlerts: [],
    from: new Date(),
    to: new Date(),
    devices: [],
    devices2: [],
    devices3: [],
    deviceStatus: [
      {
        name: 'workings',
        value: 100
      },
      {
        name: 'alerts',
        value: 0
      },
      {
        name: 'damaged',
        value: 0
      }
    ]
  }

  onSites = () => {
    this.props.history.replace(`/sites`)
  }

  componentDidMount() {
    NetworkOperation.getDevices().then(({ data }) => {
      this.setState({
        devices: data.devices,
        devices2: data.devices2,
        devices3: data.devices3
      })
    })
    // Init socket with userId and token
    this.initSocket()
  }

  initSocket() {
    this.socket = io()

    this.socket.on('connect', () => {
      this.socket.emit('join', this.props.credentials.company.name)
    })

    this.socket.on('refresh', () => {
      NetworkOperation.getDevices().then(({ data }) => {
        this.setState({
          data
        })
      })
    })
  }

  render() {
    const { state: { deviceStatus } } = this

    return (
      <div className="users app-content small-padding sensors">
        <Helmet>
          <title>Connus | Sensores</title>
        </Helmet>
        <div className="content">
          <h2>Equipos IZZI</h2>
          <div className="overall-container">
            <div className="horizontal-container">
              {this.state.devices.map((device, key) => (
                <Card
                  title={device.device}
                  className={`graph-container`}
                  key={key}>
                  <div className="graph">
                    <PieChart width={160} height={160}>
                      <Pie
                        animationBegin={0}
                        dataKey="value"
                        data={deviceStatus}
                        cx={75}
                        cy={75}
                        innerRadius={55}
                        outerRadius={75}
                        strokeWidth={0}
                        label>
                        {data.map(({ name }, index) => (
                          <Cell key={index} fill={getColor(name)} />
                        ))}
                      </Pie>
                    </PieChart>

                    <h1>{device.status}</h1>
                  </div>
                  <div className="border button">{device.ip}</div>
                  <div className="center">
                    {device.output.map((out, key) => (
                      <p key={key}>
                        {out.key} {out.value}
                      </p>
                    ))}
                  </div>
                </Card>
              ))}

              {this.state.devices2.map((device, key) => (
                <Card
                  title={device.device}
                  className={`graph-container`}
                  key={key}>
                  <div className="graph">
                    <PieChart width={160} height={160}>
                      <Pie
                        animationBegin={0}
                        dataKey="value"
                        data={deviceStatus}
                        cx={75}
                        cy={75}
                        innerRadius={55}
                        outerRadius={75}
                        strokeWidth={0}
                        label>
                        {data.map(({ name }, index) => (
                          <Cell key={index} fill={getColor(name)} />
                        ))}
                      </Pie>
                    </PieChart>

                    <h1>{device.status}</h1>
                  </div>
                  <div className="border button">{device.ip}</div>
                  <div className="center">
                    {device.output.map((out, key) => (
                      <p key={key}>
                        {out.key} {out.value}
                      </p>
                    ))}
                  </div>
                </Card>
              ))}

              {this.state.devices3.map((device, key) => (
                <Card
                  title={device.device}
                  className={`graph-container`}
                  key={key}>
                  <div className="graph">
                    <PieChart width={160} height={160}>
                      <Pie
                        animationBegin={0}
                        dataKey="value"
                        data={deviceStatus}
                        cx={75}
                        cy={75}
                        innerRadius={55}
                        outerRadius={75}
                        strokeWidth={0}
                        label>
                        {data.map(({ name }, index) => (
                          <Cell key={index} fill={getColor(name)} />
                        ))}
                      </Pie>
                    </PieChart>

                    <h1>{device.status}</h1>
                  </div>
                  <div className="border button">{device.ip}</div>
                  <div className="center">
                    {device.output.map((out, key) => (
                      <p key={key}>
                        {out.key} {out.value}
                      </p>
                    ))}
                  </div>
                </Card>
              ))}

              {this.state.fuel ||
              (this.state.fuel === 0 &&
                !this.props.credentials.company.name === 'AT&T') ? (
                <Card title="Nivel de Combustible">
                  <div>
                    <FuelChart
                      fuel={this.state.fuel}
                      height={160}
                      width={110}
                      percentage={80}
                    />
                  </div>
                  <div className="center">
                    <h3>{this.state.fuel}% promedio</h3>
                    {this.state.fuel &&
                      (!this.state.fuel && 'Ningún sitio dañado')}
                    <p className="border warning button" onClick={this.onSites}>
                      {/* this.state.fuel && (this.state.fuel) */} Sitios
                    </p>
                  </div>
                </Card>
              ) : null}
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

export default connect(mapStateToProps)(Devices)
