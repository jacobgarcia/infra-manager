import React from 'react'
import PropTypes from 'prop-types'

function BatteryChart(props) {
  return (
    /*<div
      className="battery-chart"
      style={{ width: props.width, height: props.height }}>
      <div className="unbar" />
      <div className="bar" />
      <div className="bar" />
      <div className="bar" />
      <div className="bar" />
      <div className="bar" />
      <div className="bar" />
      <div className="bar" />
    </div>*/
    <div
      className="fuel-chart"
      style={{ width: props.width, height: props.height }}>
      <div className="fuel" style={{ height: `${props.energy}%` }} />
    </div>
  )
}

BatteryChart.defaultProps = {
  width: 120,
  height: 60,
  energy: 0
}

BatteryChart.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  energy: PropTypes.number
}

export default BatteryChart
