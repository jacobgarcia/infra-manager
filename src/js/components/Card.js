import React from 'react'

function Card(props) {
  return (
    <div className={`card ${props.className}`}>
      {
        props.title
        &&
        <div className="title">
          { props.title }
        </div>
      }
      <div className="content">
        { props.children }
      </div>
    </div>
  )
}

export default Card
