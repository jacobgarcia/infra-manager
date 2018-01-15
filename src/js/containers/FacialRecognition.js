import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import { Table, RiskBar } from '../components'
import { } from '../actions'

class FacialRecognition extends Component {
  constructor(props) {
    super(props)

    this.state = {
      logs: [0,0,0,0,0,0,0],
      selectedElementIndex: [null,null],
      showLogDetail: false
    }

    this.onLogSelect = this.onLogSelect.bind(this)
  }

  onLogSelect(item) {
    this.setState({
      showLogDetail: true,
      selectedLog: item
    })
  }

  render() {
    const { state, props } = this

    return (
      <div className="app-content facial-recognition small-padding">
        <Helmet>
          <title>Connus | Reconocimiento Facial</title>
        </Helmet>
        <div className="content">
          <h2>Reconocimiento Facial</h2>
          <Table
            actionsContainer={
              <div>
                <input type="button" value="Enero 3 - Hoy" />
                <input type="button" value="filtrar"/>
              </div>
            }
            selectedElementIndex={state.selectedElementIndex}
            element={(item, index, sectionIndex) =>
              <div className={`table-item ${state.selectedElementIndex[0] === index && state.selectedElementIndex[1] === sectionIndex ? 'selected' : ''}`}
                key={index}
                onClick={() => this.onLogSelect(item, index, sectionIndex)}>
                <div className="medium">3 Enero <span>7:45 AM</span></div>
                <div className="large">Placas registradas con el vehiculo no coinciden</div>
                <div>Norte</div>
                <div>{index + 10}</div>
                <div><RiskBar risk={(index % 4) + 1} /></div>
                <div className="medium">Acceso denegado</div>
              </div>
            }
            elements={[
              { title: 'Registros', elements: state.logs },
              { title: 'Alertas', elements: state.alerts }
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
          <div className={`log-detail-container ${state.showLogDetail ? '' : 'hidden'}`}>
            <div className="content">
              <span onClick={() => this.setState({ showLogDetail: false, selectedElementIndex: [null,null] })} className="close">Cerrar</span>
              <div className="time-location">
                <p>3 Enero 07:45 PM</p>
                <p>Zona <span>Norte</span> Sitio <span>5</span></p>
              </div>
              <div className="detail">
                <span>Rostro detectado</span>
                <div className="image-slider">

                </div>
              </div>
              <div className="details-container">
                <div className="detail">
                  <span>Hora del suceso</span>
                  <p>Kia</p>
                </div>
                <div className="detail">
                  <span>Tipo de ingreso</span>
                  <p>Kia</p>
                </div>
                <div className="detail">
                  <span>Método de ingreso</span>
                  <p>Kia</p>
                </div>
                <div className="detail">
                  <span>Coincide con registro</span>
                  <p>Si</p>
                </div>
                <div className="detail">
                  <span>Estatus</span>
                  <p>Continua dentro</p>
                </div>
                <div className="detail">
                  <span>Huella dactilar</span>
                  <img src="" alt=""/>
                </div>
                <div className="detail">
                  <span>Código único de identificación</span>
                  <img src="" alt=""/>
                </div>
              </div>
              <div className="action destructive">
                <p>Contactar seguridad</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

FacialRecognition.propTypes = {

}

function mapStateToProps({}) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FacialRecognition)
