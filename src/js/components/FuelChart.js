import React from 'react'
import PropTypes from 'prop-types'

function FuelChart(props) {
  return (
    <div
      className="fuel-chart"
      style={{ width: props.width, height: props.height }}>
      <div className="fuel" style={{ height: `${props.fuel}%` }} />
    </div>
  )
}

FuelChart.defaultProps = {
  percentage: 0,
  fuel: 0
}

FuelChart.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  percentage: PropTypes.number
}

export default FuelChart
