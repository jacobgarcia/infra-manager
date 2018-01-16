import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Table extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: 0
    }
  }

  render() {
    const { state, props } = this

    return (
      <div className={`table-container ${props.className}`}>
        <div className="table-container-header">
          <ul className="inline-nav">
            {
              props.elements.map(({title}, index) =>
                <li
                  key={index}
                  className={state.selected === index ? 'active' : ''}
                  onClick={() => this.setState({ selected: index })}
                  >{title}
                </li>
              )
            }
          </ul>
          { props.actionsContainer }
        </div>
        <div className="table">
          <div className="table-header">
            <div className="table-item">
              {
                props.titles.map((element, index) => {
                  switch (typeof element) {
                    case 'string': return <div key={index}>{element}</div>
                    case 'object': return <div key={index} className={element.className}>{element.title}</div>
                    default: return null
                  }
                })
              }
            </div>
          </div>
          <div className="table-body">
            {
              (props.elements
                && props.elements.length - 1 > state.selected
                && props.elements[state.selected]
              )
              &&
              (props.elements[state.selected].elements && props.elements[state.selected].elements.length > 1)
              ?
              props.elements[state.selected].elements.map((element, index) =>
                props.element(element, index, state.selected)
              )
              :
              <p className="no-info">Sin información</p>
            }
          </div>
        </div>
      </div>
    )
  }
}

Table.propTypes = {

}

export default Table
