import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { PieChart, Pie, Cell, AreaChart, XAxis, LineChart, CartesianGrid, Tooltip as RechartsTooltip, ReferenceLine, Area, ResponsiveContainer,ComposedChart, YAxis, Bar, Line } from 'recharts'
import { DateRangePicker, Card, Tooltip } from '../components'
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
                  <PieChart width={200} height={200}>
                    <Pie
                      animationBegin={0} dataKey="value" data={data}
                      cx={95} cy={95} innerRadius={60} outerRadius={95}
                      strokeWidth={0} label>
                      {
                        data.map(({name}, index) =>
                          <Cell key={index} fill={getColor(name)}/>
                        )
                      }
                    </Pie>
                    <RechartsTooltip isAnimationActive={false} content={Tooltip} />
                  </PieChart>
                  <h1>100%</h1>
                </div>
                <div>
                  Ningún Sitio Dañado
                  <p className="border button" onClick={() => this.setState({detail: 'performance'})}>Detalles</p>
                </div>
              </Card>
              <Card
                title="Batería"
              >
                <div></div>
                <div>
                  <h3>89% promedio</h3>
                  <p>Sin batería</p>
                  <p className="border button" onClick={() => this.setState({detail: 'performance'})}>9 Sitios</p>
                </div>
              </Card>
              <Card
                title="Combustible"
              >
                <div></div>
                <div>
                  <h3>89% promedio</h3>
                  <p>Sin batería</p>
                  <p className="border button" onClick={() => this.setState({detail: 'performance'})}>9 Sitios</p>
                </div>
              </Card>
              <Card
                title="Presión"
              >
                <div className="graph">
                  <PieChart width={200} height={200}>
                    <Pie
                      animationBegin={0} dataKey="value" data={data}
                      cx={95} cy={95} innerRadius={60} outerRadius={95}
                      strokeWidth={0} label>
                      {
                        data.map(({name}, index) =>
                          <Cell key={index} fill={getColor(name)}/>
                        )
                      }
                    </Pie>
                    <RechartsTooltip isAnimationActive={false} content={Tooltip} />
                  </PieChart>
                </div>
                <div>
                  <h3>1043 Pa</h3>
                  Ningún Sitio Dañado
                  <p className="border button" onClick={() => this.setState({detail: 'performance'})}>Detalles</p>
                </div>
              </Card>
              <Card
                title="Tuberías"
              >
                <div></div>
                <div>
                  <h3>89% promedio</h3>
                  <p>Sin batería</p>
                  <p className="border button" onClick={() => this.setState({detail: 'performance'})}>9 Sitios</p>
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
