import React from 'react'

function Card(props) {
  return (
    <div className={`card ${props.className} ${props.full ? 'full' : ''}`}>
      <div className="card-header">
        {
          props.title
          &&
          <div className="title">
            { props.title }
          </div>
        }
        {
          props.detailActions && props.full
          &&
          <div className="actions">
            { props.detailActions }
          </div>
        }
      </div>
      <div className="card-content">
        {
          props.full
          ? props.detailView
          : props.children
        }
      </div>
    </div>
  )
}

export default Card
