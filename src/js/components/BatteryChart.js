import React from 'react'

function BatteryChart(props) {
  return (
    <div className="battery-chart" style={{width: props.width, height: props.height}}>
      <div className="unbar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
    </div>
  )
}

BatteryChart.defaultProps = {
  width: 110,
  height: 60
}

export default BatteryChart
