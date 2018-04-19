import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts'
import { DateRangePicker, Card, Tooltip, BatteryChart, FuelChart } from '../components'
import { NetworkOperation } from '../lib'
import { getColor,itemAverage,itemStatus } from '../lib/specialFunctions'

const data = [
  { name: 'workings', value: 100 },
  { name: 'alerts', value: 0 },
  { name: 'damaged', value: 0 }
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
    NetworkOperation.getSensors()
    .then(({data}) => {
      console.log(data.inventoryReports);
      this.setState({
        aperture : parseInt(itemAverage("cs",data.inventoryReports)),
        vibration :parseInt( itemAverage("vs",data.inventoryReports)),
        temperature :parseInt( itemAverage("vs",data.inventoryReports)),
        energy :parseInt( itemAverage("vs",data.inventoryReports)),
        apertureStatus : itemStatus("cs",data.inventoryReports,"upscale",80,20),
        vibrationStatus : itemStatus("vs",data.inventoryReports,"upscale",80,20),
        temperatureStatus : itemStatus("ts",data.inventoryReports,"between",50,0),
        energyStatus : itemStatus("es",data.inventoryReports,"between",130,100),
        battery :parseInt( itemAverage("vs",data.inventoryReports)),
        fuel :parseInt( itemAverage("vs",data.inventoryReports)),
      })

    })
    NetworkOperation.getAlerts()
    .then(({data}) => {
      // this.setState({
      //   alerts: this.props.credentials.company.name === 'Connus' ? data.alerts.filter($0 => $0.site === 'CNHQ9094') : data.alerts.filter($0 => $0.site != 'CNHQ9094')
       })

    NetworkOperation.getInventory().then(({ data }) => {
      data.sites.map(site => {
        
      })
    })
  }

  render() {
    const { state, props } = this
    const temperatureStatus = this.state.temperatureStatus
    const vibrationStatus = this.state.vibrationStatus
    const apertureStatus = this.state.apertureStatus

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
                      animationBegin={0} dataKey="value" data={temperatureStatus}
                      cx={75} cy={75} innerRadius={55} outerRadius={75}
                      strokeWidth={0} label>
                      {
                        data.map(({name}, index) =>
                          <Cell key={index} fill={getColor(name)}/>
                        )
                      }
                    </Pie>
                    <RechartsTooltip
                      isAnimationActive={false}
                      content={Tooltip}
                    />
                  </PieChart>
                  <h1>{this.state.temperature && this.state.temperature}</h1>
                </div>
                <div className="center">
                  { (temperatureStatus && (!temperatureStatus[2].value && "activaciones")) }
                  <p className="border button" onClick={this.onSites}>
                    { (temperatureStatus && (temperatureStatus[2].value && temperatureStatus[2].value)) } sitios
                  </p>
                </div>
              </Card>
              <Card title="Vibración" className={`graph-container`}>
                <div className="graph">
                  <PieChart width={160} height={160}>
                    <Pie
                      animationBegin={0} dataKey="value" data={vibrationStatus}
                      cx={75} cy={75} innerRadius={55} outerRadius={75}
                      strokeWidth={0} label>
                      {
                        data.map(({name}, index) =>
                          <Cell key={index} fill={getColor(name)}/>
                        )
                      }
                    </Pie>
                    <RechartsTooltip
                      isAnimationActive={false}
                      content={Tooltip}
                    />
                  </PieChart>
                  <h1>{this.state.vibration && this.state.vibration}</h1>
                </div>
                <div className="center">
                {  (vibrationStatus && (!vibrationStatus[2].value && "activaciones")) }

                  <p className="border button" onClick={this.onSites}>
                  { (vibrationStatus && (vibrationStatus[2].value && vibrationStatus[2].value)) } sitios
                  </p>
                </div>
              </Card>
              <Card title="Apertura" className={`graph-container`}>
                <div className="graph">
                  <PieChart width={160} height={160}>
                    <Pie
                      animationBegin={0} dataKey="value" data={apertureStatus}
                      cx={75} cy={75} innerRadius={55} outerRadius={75}
                      strokeWidth={0} label>
                      {
                        data.map(({name}, index) =>
                          <Cell key={index} fill={getColor(name)}/>
                        )
                      }
                    </Pie>
                    <RechartsTooltip
                      isAnimationActive={false}
                      content={Tooltip}
                    />
                  </PieChart>
                  <h1>{this.state.aperture && this.state.aperture}</h1>
                </div>
                <div className="center">
                {  (vibrationStatus && (!vibrationStatus[2].value && "accesos")) }

                  <p className="border button" onClick={this.onSites}>
                    { (apertureStatus && (apertureStatus[2].value && apertureStatus[2].value)) } sitios
                  </p>
                </div>
              </Card>
              <Card
                title="Corriente"
                className={`graph-container`}
              >
                <div className="graph">
                  <PieChart width={160} height={160}>
                    <Pie
                      animationBegin={0} dataKey="value" data={this.state.energyStatus}
                      cx={75} cy={75} innerRadius={55} outerRadius={75}
                      strokeWidth={0} label>
                      {
                        data.map(({name}, index) =>
                          <Cell key={index} fill={getColor(name)}/>
                        )
                      }
                    </Pie>
                    <RechartsTooltip
                      isAnimationActive={false}
                      content={Tooltip}
                    />
                  </PieChart>
                  <h1>{this.state.energy && this.state.energy }</h1>
                </div>
                <div className="center">
                {this.state.energy && (!this.state.energy && "Ningún sitio dañado")}

                  <p className="border button" onClick={this.onSites}>
                    {/*this.state.energy && (this.state.energy) */}
                     sitios
                  </p>
                </div>
              </Card>
              <Card title="Nivel de Batería">
                <div>
                  <BatteryChart  energy={this.state.energy} height={160} width={110} />
                </div>
                <div className="center">
                  <h3>{this.state.energy}% promedio</h3>
                  {this.state.battery && (!this.state.battery && "Ningún sitio dañado")}
                  <p className="border button" onClick={this.onSites}>
                    {/*this.state.battery && (this.state.battery) */} Sitios
                  </p>
                </div>
              </Card>
              <Card title="Nivel de Combustible">
                <div>
                  <FuelChart fuel={this.state.fuel} height={160} width={110} percentage={80} />
                </div>
                <div className="center">
                  <h3>{this.state.fuel}% promedio</h3>
                  {this.state.fuel && (!this.state.fuel && "Ningún sitio dañado")}
                  <p className="border warning button" onClick={this.onSites}>
                    {/*this.state.fuel && (this.state.fuel) */} Sitios
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
