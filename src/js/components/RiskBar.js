import React from 'react'
import PropTypes from 'prop-types'

function RiskBar(props) {
  return (
    <div className="risk-bar-container">
      {
        [0,0,0].map((element, index) =>
          <div
            className={`bar risk-${props.risk}`}
            key={index}
          />
        )
      }
    </div>
  )
}

RiskBar.propTypes = {
  risk: PropTypes.number
}

export default RiskBar
