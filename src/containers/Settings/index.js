import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { NetworkOperation } from 'lib'

class Settings extends Component {
  static propTypes = {
    credentials: PropTypes.object
  }

  state = {
    name: 'Operador Fibercorp',
    permissions: 4,
    photo: null,
    email: 'operador@fibercorp.com',
    file: null,
    changed: false
  }

  onPhotoSelect = event => {
    if (event.target.files.length < 1) return
    this.setState({
      file: event.target.files[0],
      changed: true
    })
  }

  onChange = event => {
    const { value, name } = event.target

    this.setState({
      [name]: value
    })
  }

  onSave = event => {
    event.preventDefault()

    this.setState({
      photo: null
    })

    NetworkOperation.uploadProfilePhoto(this.state.file)
      .then(({ data }) => {
        this.setState({
          photo: data.photo,
          changed: false
        })
      })
      .catch(error => {
        console.error(error)
      })
  }

  render() {
    const { state, props } = this

    return (
      <div className="settings app-content">
        <Helmet>
          <title>Connus | Ajustes</title>
        </Helmet>
        <div className="content vertical">
          <ul className="mini-nav vertical">
            <li className="active">Perfil</li>
            {/* <li>Personalizar</li> */}
          </ul>
          <form onSubmit={this.onSave}>
            <div className="field">
              <label htmlFor="">Foto</label>
              <label
                htmlFor="photo"
                className="photo"
                style={{
                  backgroundImage: `url(${state.photo ||
                    (props.credentials.user &&
                      props.credentials.user.photoUrl)})`,
                  backgroundColor: state.photo ? 'white' : 'transparent'
                }}
              />
              <input
                type="file"
                id="photo"
                accept="image/png, image/jpg, image/jpeg"
                onChange={this.onPhotoSelect}
              />
            </div>
            <div className="field">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                placeholder="Nombre"
                value={props.credentials.user.name}
              />
            </div>
            <div className="field">
              <label htmlFor="email">Correo</label>
              <input
                type="text"
                placeholder="Correo"
                value={props.credentials.user.email}
              />
            </div>
            <span className="rule">Cambiar contraseña</span>
            <div className="field">
              <label htmlFor="name">Contraseña actual</label>
              <input
                type="password"
                placeholder=""
                value={props.credentials.user.name}
              />
            </div>
            <div className="field">
              <label htmlFor="name">Nueva contraseña</label>
              <input type="text" placeholder="" />
            </div>
            {state.changed && (
              <input type="submit" value="Guardar" className="action" />
            )}
          </form>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ credentials }) {
  return {
    credentials
  }
}

export default connect(mapStateToProps)(Settings)
