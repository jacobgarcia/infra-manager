import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import { Table, RiskBar } from '../components'
import { } from '../actions'

class Accesses extends Component {
  constructor(props) {
    super(props)

    this.state = {
      logs: this.props.accessReports,
      selectedElementIndex: [null,null],
      showLogDetail: false,
      from: new Date(),
      to: new Date()
    }
  }

  componentDidMount(){
    console.log(this.props.accessReports)
  }

  render() {
    const { state, props } = this

    return (
      <div className="app-content accesses small-padding">
        <Helmet>
          <title>Connus | Accesos</title>
        </Helmet>
        <div className="content">
          <h2>Accesos</h2>
          <Table
            actionsContainer={
              <div>
                <p className="button action">Enero 3 - Hoy</p>
                <p className="button action">Filtrar</p>
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
      </div>
    )
  }
}

Accesses.propTypes = {
  accessReports: PropTypes.array
}

function mapStateToProps({accessReports}) {
  return {
    accessReports
  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Accesses)
