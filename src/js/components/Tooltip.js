import React from 'react'
import PropTypes from 'prop-types'

const Tooltip = ({ payload, label }) => (
  <div className="tooltip">
    <span>{label}</span>
    {payload &&
      payload.map((element, index) => (
        <div key={index}>
          <span className="icon" style={{ backgroundColor: element.color }} />
          <p>
            {element.name}: {element.value}
          </p>
        </div>
      ))}
  </div>
)

Tooltip.propTypes = {
  payload: PropTypes.array,
  label: PropTypes.string
}

export default Tooltip
