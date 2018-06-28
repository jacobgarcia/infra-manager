import React, { Component } from 'react'

class Alerts extends Component {
  constructor(props) {
    super(props)

    this.state = {
      alerts: {
        today: [],
        before: []
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.alerts.length === nextProps.alerts.length) return

    const today = new Date().getDay()
    const alerts = {
      today: [],
      before: []
    }

    this.props.alerts.map(alert => {
      alert.alarms.map(({ timestamp }) => {
        if (new Date(timestamp).getDay() === today) {
          alerts.today = alerts.today.concat([{ timestamp, ...alert }])
        } else {
          alerts.before = alerts.before.concat([{ timestamp, ...alert }])
        }
      })
    })

    this.setState({
      alerts
    })
  }

  render() {
    const { state, props } = this
    return (
      <div className={`alerts ${!props.isVisible && 'hidden'}`}>
        <div className="content">
          <div
            className={`tooltip ${props.isCreating && 'hidden'}`}
            onClick={props.onVisibleToggle}
          />
          <div>
            {state.alerts.today.map((alert, index) => (
              <p key={index}>{JSON.stringify(alert.timestamp)}</p>
            ))}
            {state.alerts.before.map((alert, index) => {
              const date = new Date(alert.timestamp)

              return (
                <div key={index}>
                  <span className="date">
                    {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}

Alerts.defaultProps = {
  alerts: []
}

Alerts.propTypes = {
  alerts: []
}

export default Alerts
