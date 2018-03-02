import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DayPicker, { DateUtils } from 'react-day-picker'

import { getFriendlyDateRange } from '../lib/constants'

class DateRangePicker extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isVisible: false
    }
  }

  render() {
    const { state, props } = this
    return (
      <div className={`range-select-container ${state.isVisible ? '' : 'hidden'}`}>
        <p className="button" onClick={() => this.setState(prev => ({isVisible: !prev.isVisible}))}>{(!props.from && !props.to) ? 'Seleccionar periodo' : getFriendlyDateRange(props.from, props.to)}</p>
        <DayPicker
          months={['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']}
          weekdaysShort={['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']}
          className="Selectable"
          numberOfMonths={1}
          selectedDays={[props.from, { from: props.from, to: props.to }]}
          onDayClick={props.onDayClick}
          modifiers={{start: props.from, end: props.to}}
          showOutsideDays
        />
      </div>
    )
  }
}

DateRangePicker.propTypes = {

}

export default DateRangePicker
