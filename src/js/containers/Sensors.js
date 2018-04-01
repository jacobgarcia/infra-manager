import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts'
import { DateRangePicker, Card, Tooltip, BatteryChart, FuelChart } from '../components'
import { NetworkOperation, NetworkOperationFRM } from '../lib'
import { getColor } from '../lib/specialFunctions'

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
  }

  componentDidMount() {

    NetworkOperationFRM.getAlerts()
    .then(({data}) => {
      // this.setState({
      //   alerts: this.props.credentials.company.name === 'Connus' ? data.alerts.filter($0 => $0.site === 'CNHQ9094') : data.alerts.filter($0 => $0.site != 'CNHQ9094')
      // })
    })

    // Start socket connection
    // this.initSockets(this.props)
  }

  render() {
    const { state, props } = this

    return (
      <div className="users app-content small-padding sensors">
        <Helmet>
          <title>Connus | Sensores</title>
        </Helmet>
        <div className="content">
          <h2>
            Estatus
            <div className="actions">
              <DateRangePicker
                from={state.from}
                to={state.to}
                onDayClick={this.onDayClick}
              />
              <div className="button">Filtrar</div>
            </div>
          </h2>
          <div className="overall-container">
          <div className="horizontal-container">
              <Card
                title="Temperatura"
                className={`graph-container`}
              >
                <div className="graph">
                  <PieChart width={160} height={160}>
                    <Pie
                      animationBegin={0} dataKey="value" data={data}
                      cx={75} cy={75} innerRadius={55} outerRadius={75}
                      strokeWidth={0} label>
                      {
                        data.map(({name}, index) =>
                          <Cell key={index} fill={getColor(name)}/>
                        )
                      }
                    </Pie>
                    <RechartsTooltip isAnimationActive={false} content={Tooltip} />
                  </PieChart>
                  <h1>22º</h1>
                </div>
                <div className="center">
                  Ningún Sitio Dañado
                  <p className="border button" onClick={() => this.setState({detail: 'performance'})}>8 sitios</p>
                </div>
              </Card>
              <Card
                title="Vibración"
              >
                <div>
                  <BatteryChart
                    height={160}
                    width={110}
                  />
                </div>
                <div className="center">
                  <p>Ningún sitio alertado</p>
                  <p className="border button" onClick={() => this.setState({detail: 'performance'})}>8 Sitios</p>
                </div>
              </Card>
              <Card
                title="Contacto"
              >
                <div>
                  <FuelChart
                    height={160}
                    width={110}
                    percentage={100}
                  />
                </div>
                <div className="center">
                  <p>Ningún sitio alertado</p>
                  <p className="border button" onClick={() => this.setState({detail: 'performance'})}>8 Sitios</p>
                </div>
              </Card>
              <Card
                title="Corriente"
                className={`graph-container`}
              >
                <div className="graph">
                  <PieChart width={160} height={160}>
                    <Pie
                      animationBegin={0} dataKey="value" data={data}
                      cx={75} cy={75} innerRadius={55} outerRadius={75}
                      strokeWidth={0} label>
                      {
                        data.map(({name}, index) =>
                          <Cell key={index} fill={getColor(name)}/>
                        )
                      }
                    </Pie>
                    <RechartsTooltip isAnimationActive={false} content={Tooltip} />
                  </PieChart>
                  <h1>5.5 A</h1>
                </div>
                <div className="center">
                  Ningún Sitio Dañado
                  <p className="border button" onClick={() => this.setState({detail: 'performance'})}>8 sitios</p>
                </div>
              </Card>
              <Card
                title="Nivel de Agua"
              >
                <div>
                  <FuelChart
                    height={160}
                    width={110}
                    percentage={60}
                  />
                </div>
                <div className="center">
                  <h3>60% promedio</h3>
                  <p>Ningún sitio alertado</p>
                  <p className="border button" onClick={() => this.setState({detail: 'performance'})}>8 Sitios</p>
                </div>
              </Card>
              <Card
                title="Nivel de Combustible"
              >
                <div>
                  <FuelChart
                    height={160}
                    width={110}
                    percentage={80}
                  />
                </div>
                <div className="center">
                  <h3>80% promedio</h3>
                  <p>Dañadas</p>
                  <p className="border button" onClick={() => this.setState({detail: 'performance'})}>8 Sitios</p>
                </div>
              </Card>
          </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({zones, credentials}) {
  return {
    zones,
    credentials
  }
}

Users.propTypes = {
  credentials: PropTypes.object
}

export default connect(mapStateToProps)(Users)
