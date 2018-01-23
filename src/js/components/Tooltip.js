import React from 'react'

const Tooltip = ({payload, label}) => (
  <div className="tooltip">
    <span>{label}</span>
    {
      payload &&
      payload.map((element, index) =>
        <div key={index}>
          <span className="icon" style={{backgroundColor: element.color}} />
          <p>{element.name}: {element.value}</p>
        </div>
      )
    }
  </div>
)

export default Tooltip
