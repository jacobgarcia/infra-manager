import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

class Table extends PureComponent {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
      selected: props.selected ? props.selected : 0
    }
  }

  render() {
    const { state, props } = this

    return (
      <div className={`table-container ${props.className}`}>
        <div className="table-container-header">
          <ul className="inline-nav">
            {props.multipleTable ? (
              props.elements.map(({ title }, index) => (
                <li
                  key={index}
                  className={state.selected === index ? 'active' : ''}
                  onClick={() => {
                    if (props.setState) {
                      props.setState(index)
                      this.setState({ selected: index })
                    } else this.setState({ selected: index })
                  }}>
                  {title}
                </li>
              ))
            ) : (
              <li>{props.title}</li>
            )}
          </ul>
          {props.actionsContainer}
        </div>
        <div className="table">
          <div className="table-header">
            <div className="table-item">
              {props.titles.map((element, index) => {
                switch (typeof element) {
                  case 'string':
                    return <div key={index}>{element}</div>
                  case 'object':
                    return (
                      <div key={index} className={element.className}>
                        {element.title}
                      </div>
                    )
                  default:
                    return null
                }
              })}
            </div>
          </div>
          <div className="table-body">
            {props.multipleTable ? (
              props.elements &&
              props.elements[state.selected] &&
              (props.elements[state.selected].elements &&
                props.elements[state.selected].elements.length > 0) ? (
                props.elements[state.selected].elements.map((element, index) =>
                  props.element(element, index, state.selected)
                )
              ) : (
                <p className="no-info">Sin información</p>
              )
            ) : props.elements && props.elements.length > 0 ? (
              props.elements.map((element, index) =>
                props.element(element, index, state.selected)
              )
            ) : (
              <p className="no-info">Sin información</p>
            )}
          </div>
        </div>
      </div>
    )
  }
}

Table.propTypes = {
  selected: PropTypes.number,
  setState: PropTypes.func
}

export default Table
