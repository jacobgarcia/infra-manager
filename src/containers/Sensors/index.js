import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts'
import io from 'socket.io-client'

import { Card, Tooltip, BatteryChart, FuelChart } from 'components'
import { NetworkOperation } from 'lib'
import { getColor, itemAverage, itemStatus } from 'lib/specialFunctions'

const data = [
  { name: 'workings', value: 100 },
  { name: 'alerts', value: 0 },
  { name: 'damaged', value: 0 }
]

class Users extends Component {
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
    to: new Date()
  }

  onSites = () => {
    this.props.history.replace(`/sites`)
  }

  componentDidMount() {
    console.log(this);
    NetworkOperation.getSensors().then(({ data }) => {
      this.setState({
        aperture: parseInt(itemAverage('cs', data.sensors), 10),
        vibration: parseInt(itemAverage('vs', data.sensors), 10),
        temperature: parseInt(itemAverage('ts', data.sensors), 10),
        energy: parseInt(itemAverage('cu', data.sensors), 10),
        apertureStatus: itemStatus('cs', data.sensors, 'upscale', 80, 20),
        vibrationStatus: itemStatus('vs', data.sensors, 'upscale', 80, 20),
        temperatureStatus: itemStatus('ts', data.sensors, 'between', 50, 0),
        ambienceStatus: itemStatus('as', data.sensors, 'between', 40, 0),
        energyStatus: itemStatus('cu', data.sensors, 'between', 130, 100),
        battery: parseInt(itemAverage('bs', data.sensors), 10),
        fuel: parseInt(itemAverage('fs', data.sensors), 10)
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
      NetworkOperation.getSensors().then(({ data }) => {
        this.setState({
          aperture: parseInt(itemAverage('cs', data.sensors), 10),
          vibration: parseInt(itemAverage('vs', data.sensors), 10),
          temperature: parseInt(itemAverage('ts', data.sensors), 10),
          energy: parseInt(itemAverage('cu', data.sensors), 10),
          apertureStatus: itemStatus('cs', data.sensors, 'upscale', 80, 20),
          vibrationStatus: itemStatus('vs', data.sensors, 'upscale', 80, 20),
          temperatureStatus: itemStatus('ts', data.sensors, 'between', 50, 0),
          ambienceStatus: itemStatus('as', data.sensors, 'between', 40, 0),
          energyStatus: itemStatus('cu', data.sensors, 'between', 130, 100),
          battery: parseInt(itemAverage('bs', data.sensors), 10),
          fuel: parseInt(itemAverage('fs', data.sensors), 10)
        })
      })
    })
  }

  render() {
    const {
      state: { temperatureStatus, vibrationStatus, apertureStatus }
    } = this


    return (
      <div className="users app-content small-padding sensors">
        <Helmet>
          <title>Connus | Sensores</title>
        </Helmet>
        <div className="content">
          <h2>Estatus</h2>
          <div className="overall-container">
            <div className="horizontal-container">
              {this.state.temperature && !this.props.credentials.company.name === "AT&T" ? (
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

              <Card title="Vibración" className={`graph-container`}>
                <div className="graph">
                  <PieChart width={160} height={160}>
                    <Pie
                      animationBegin={0}
                      dataKey="value"
                      data={vibrationStatus}
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
                  <h1>{this.state.vibration && this.state.vibration}</h1>
                </div>
                <div className="center">
                  {vibrationStatus && (!vibrationStatus[2].value && 'Alertas')}

                  <p className="border button" onClick={this.onSites}>
                    {vibrationStatus && vibrationStatus.length} sitios
                  </p>
                </div>
              </Card>
              <Card title="Apertura" className={`graph-container`}>
                <div className="graph">
                  <PieChart width={160} height={160}>
                    <Pie
                      animationBegin={0}
                      dataKey="value"
                      data={apertureStatus}
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
                  <h1>{this.state.aperture && this.state.aperture}</h1>
                </div>
                <div className="center">
                  {vibrationStatus && (!vibrationStatus[2].value && 'Alertas')}

                  <p className="border button" onClick={this.onSites}>
                    {apertureStatus && apertureStatus.length} sitios
                  </p>
                </div>
              </Card>

              {this.state.energy ? (
                <Card title="Corriente" className={`graph-container`}>
                  <div className="graph">
                    <PieChart width={160} height={160}>
                      <Pie
                        animationBegin={0}
                        dataKey="value"
                        data={this.state.energyStatus}
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
                    <h1>{this.state.energy && this.state.energy}</h1>
                  </div>
                  <div className="center">
                    {this.state.energy &&
                      (!this.state.energy && 'Ningún sitio dañado')}

                    <p className="border button" onClick={this.onSites}>
                      {/* this.state.energy && (this.state.energy) */}
                      sitios
                    </p>
                  </div>
                </Card>
              ) : null}
              {this.state.fuel || this.state.fuel === 0 && !this.props.credentials.company.name === "AT&T" ? (
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

export default connect(mapStateToProps)(Users)
