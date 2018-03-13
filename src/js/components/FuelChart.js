import React from 'react'

function FuelChart(props) {
  return (
    <div className="fuel-chart" style={{width: props.width, height: props.height}}>
      <div className="fuel" style={{height: `${props.percentage}%`}}></div>
    </div>
  )
}

FuelChart.defaultProps = {
  percentage: 0
}

export default FuelChart
