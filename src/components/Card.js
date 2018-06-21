import React from 'react'
import PropTypes from 'prop-types'

function Card(props) {
  return (
    <div className={`card ${props.className} ${props.full ? 'full' : ''}`}>
      <div className="card-header">
        {props.title && <div className="title">{props.title}</div>}
        {props.detailActions &&
          props.full && <div className="actions">{props.detailActions}</div>}
      </div>
      <div className="card-content">
        {props.full ? props.detailView : props.children}
      </div>
    </div>
  )
}

Card.propTypes = {
  className: PropTypes.string,
  full: PropTypes.bool,
  title: PropTypes.string,
  detailActions: PropTypes.object,
  detailView: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}

export default Card
