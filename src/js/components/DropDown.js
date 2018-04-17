import React, { Component } from 'react'

class DropDown extends Component {
  constructor(props) {
    super(props)

    this.state = {
      active: false,
      selectedIndex: []
    }
  }

  render() {
    const { state, props } = this
    return (
      <div className={`drop-down ${state.active ? 'active' : ''}`}>
        <ul>
          <li onClick={() => this.setState(prev => ({ active: !prev.active }))}>
            {state.selectedIndex.length > 0
              ? props.elements
                  .filter((_, index) => state.selectedIndex.includes(index))
                  .reduce(
                    (sum, item, index) =>
                      `${sum}${item.name}${
                        index === state.selectedIndex.length - 1 ? '' : ', '
                      }`,
                    ''
                  )
              : 'Seleccionar'}
          </li>
          {props.elements.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                state.selectedIndex.includes(index)
                  ? this.setState(prev => ({
                      selectedIndex: prev.selectedIndex.filter(
                        $0 => $0 !== index
                      )
                    }))
                  : this.setState(prev => ({
                      selectedIndex: prev.selectedIndex.concat([index])
                    }))
              }}>
              <input
                type="checkbox"
                checked={state.selectedIndex.includes(index)}
                disabled
              />
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

DropDown.propTypes = {}

export default DropDown
