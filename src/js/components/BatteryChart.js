import React from 'react'
import PropTypes from 'prop-types'

function BatteryChart(props) {
  return (
    <div
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
    </div>
  )
}

BatteryChart.defaultProps = {
  width: 110,
  height: 60
}

BatteryChart.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number
}

export default BatteryChart
