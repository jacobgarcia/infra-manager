import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { DateUtils } from 'react-day-picker'
import Slider from 'react-slick'


import { Table, RiskBar, DateRangePicker } from '../components'
import { } from '../actions'

class Perimeter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      logs: this.props.perimeterReports,
      alerts: [],
      selectedElementIndex: [null, null],
      showLogDetail: false,
      from: new Date(),
      to: new Date()
    }

    this.onLogSelect = this.onLogSelect.bind(this)
    this.onDayClick = this.onDayClick.bind(this)
  }

  onLogSelect(item, index, sectionIndex) {
    this.setState({
      showLogDetail: true,
      selectedLog: item,
      selectedElementIndex: [index, sectionIndex]
    })
  }

  onDayClick(day) {
    // TODO Network operation for selected period
    const range = DateUtils.addDayToRange(day, this.state)
    this.setState(range)
  }

  render() {
    const { state, props } = this

    return (
      <div className="app-content perimeter small-padding">
        <Helmet>
          <title>Connus | Perímetro</title>
        </Helmet>
        <div className="content">
          <h2>Perímetro</h2>
          <Table
            actionsContainer={
              <div>
                <DateRangePicker
                  from={state.from}
                  to={state.to}
                  onDayClick={this.onDayClick}
                />
                <p className="button action disabled">Filtrar</p>
              </div>
            }
            selectedElementIndex={state.selectedElementIndex}
            element={(item, index, sectionIndex) =>
              <div className={`table-item ${state.selectedElementIndex[0] === index && state.selectedElementIndex[1] === sectionIndex ? 'selected' : ''}`}
                key={index}
                onClick={() => this.onLogSelect(item, index, sectionIndex)}>
                <div className="medium">{this.state.logs[index].day} <span>{this.state.logs[index].hour}</span></div>
                <div className="large">{this.state.logs[index].event}</div>
                <div>{this.state.logs[index].zone}</div>
                <div>{this.state.logs[index].site}</div>
                <div><RiskBar risk={this.state.logs[index].risk} /></div>
                <div className="medium">{this.state.logs[index].status}</div>
              </div>
            }
            elements={[
              { title: 'Registros', elements: state.logs},
              { title: 'Alertas', elements: state.alerts}
            ]}
            titles={[
              {title: 'Tiempo', className: 'medium'},
              {title: 'Suceso', className: 'large'},
              {title: 'Zona'},
              {title: 'Sitio'},
              {title: 'Riesgo'},
              {title: 'Estatus o acción', className: 'medium'}
            ]}
          />
        </div>
        { this.state.logs[this.state.selectedElementIndex[0]] ?
        <div className={`log-detail-container ${state.showLogDetail ? '' : 'hidden'}`}>
          <div className="content">
            <span onClick={() => this.setState({ showLogDetail: false, selectedElementIndex: [null,null] })} className="close">Cerrar</span>
            <div className="time-location">
              <p>{this.state.logs[this.state.selectedElementIndex[0]].day} {this.state.logs[this.state.selectedElementIndex[0]].hour}</p>
              <p>Zona <span>{this.state.logs[this.state.selectedElementIndex[0]].zone}</span> Sitio <span>{this.state.logs[this.state.selectedElementIndex[0]].site}</span></p>
            </div>
            <div>
              <video width="360" height="240" loop muted autoPlay>
                <source src={"/static/video/dummy/perimeter-0" + this.state.selectedElementIndex[0] + ".mp4"} type="video/mp4"/>
              </video>
            </div>
            <div className="detail">
              <span>Galería</span>
              <Slider nextArrow={<button>{'>'}</button>} prevArrow={<button>{'<'}</button>}>
                <div className="image-slider" style={{backgroundImage: `url(/static/img/dummy/perimterg-0` + this.state.selectedElementIndex[0] +`.png)`}} />
                <div className="image-slider" style={{backgroundImage: `url(/static/img/dummy/perimterg-1` + this.state.selectedElementIndex[0] +`.png)`}} />
                <div className="image-slider" style={{backgroundImage: `url(/static/img/dummy/perimterg-2` + this.state.selectedElementIndex[0] +`.png)`}}/>
                <div className="image-slider" style={{backgroundImage: `url(/static/img/dummy/perimterg-3` + this.state.selectedElementIndex[0] +`.png)`}}/>

              </Slider>
            </div>
            <div className="action destructive">
              <p>Contactar seguridad</p>
            </div>
          </div>
        </div>
        : <div></div>
      }
      </div>
    )
  }
}

Perimeter.propTypes = {
  perimeterReports: PropTypes.func
}

function mapStateToProps({perimeterReports}) {
  return {
    perimeterReports
  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Perimeter)
