import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts'
import io from 'socket.io-client'

import { Card, Tooltip, FuelChart } from 'components'
import { NetworkOperation } from 'lib'
import { getColor, itemAverage, itemStatus } from 'lib/specialFunctions'

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
      console.log(data)
      this.setState({
        devices: data.devices
      })
    })
    // Init socket with userId and token
    this.initSocket()
  }

  initSocket() {
    this.socket = io()

    this.socket.on('connect', () => {
      this.socket.emit('join', 'connus')
    })

    this.socket.on('refresh', () => {
      NetworkOperation.getDevices().then(({ data }) => {
        console.log(data)
        this.setState({
          data
        })
      })
    })
  }

  render() {
    const { state: { deviceStatus, vibrationStatus } } = this

    return (
      <div className="users app-content small-padding sensors">
        <Helmet>
          <title>Connus | Sensores</title>
        </Helmet>
        <div className="content">
          <h2>Equipos IZZI</h2>
          <div className="overall-container">
            <div className="horizontal-container">
              {this.state.temperature &&
              !this.props.credentials.company.name === 'AT&T' ? (
                <Card
                  title="Temperatura del procesador"
                  className={`graph-container`}>
                  <div className="graph">
                    <PieChart width={160} height={160}>
                      <Pie
                        animationBegin={0}
                        dataKey="value"
                        data={temperatureStatus}
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
                      <RechartsTooltip
                        isAnimationActive={false}
                        content={Tooltip}
                      />
                    </PieChart>
                    <h1>{this.state.temperature && this.state.temperature}</h1>
                  </div>
                  <div className="center">
                    {temperatureStatus &&
                      (!temperatureStatus[2].value && 'Alertados')}
                    <p className="border button" onClick={this.onSites}>
                      {temperatureStatus &&
                        (temperatureStatus[2].value &&
                          temperatureStatus[2].value)}{' '}
                      sitios
                    </p>
                  </div>
                </Card>
              ) : null}

              {this.state.ambience ? (
                <Card
                  title="Temperatura Ambiente"
                  className={`graph-container`}>
                  <div className="graph">
                    <PieChart width={160} height={160}>
                      <Pie
                        animationBegin={0}
                        dataKey="value"
                        data={ambienceStatus}
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
                      <RechartsTooltip
                        isAnimationActive={false}
                        content={Tooltip}
                      />
                    </PieChart>
                    <h1>{this.state.ambience && this.state.ambience}</h1>
                  </div>
                  <div className="center">
                    {ambienceStatus &&
                      (!ambienceStatus[2].value && 'Alertados')}
                    <p className="border button" onClick={this.onSites}>
                      {ambienceStatus &&
                        (ambienceStatus[2].value &&
                          ambienceStatus[2].value)}{' '}
                      sitios
                    </p>
                  </div>
                </Card>
              ) : null}
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
