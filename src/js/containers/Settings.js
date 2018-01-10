import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { NetworkOperation } from '../lib'

class Settings extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: 'John Appleseed',
      permissions: 4,
      photo: null,
      email: 'johnappleseed@kawlant.com',
      file: null,
      changed: false
    }

    this.onChange = this.onChange.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onPhotoSelect = this.onPhotoSelect.bind(this)
  }

  onPhotoSelect(event) {
    if (event.target.files.length < 1) return
    this.setState({
      file: event.target.files[0],
      changed: true
    })
  }

  onChange(event) {
    const { value, name } = event.target

    this.setState({
      [name]: value
    })
  }

  onSave(event) {
    event.preventDefault()

    this.setState({
      photo: null
    })

    NetworkOperation.uploadProfilePhoto(this.state.file)
    .then(({data}) => {
      this.setState({
        photo: data.photo,
        changed: false
      })
    })
    .catch(error => {
      console.log({error})
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
            <li>Personalizar</li>
            <li>Lista negra</li>
          </ul>
          <form onSubmit={this.onSave}>
            <div className="field">
              <label htmlFor="">Foto</label>
              <label htmlFor="photo" className="photo" style={{backgroundImage: `url(${state.photo || (this.props.credentials.user && this.props.credentials.user.photoUrl)})`, backgroundColor: state.photo ? 'white' : 'transparent' }} />
              <input type="file" id="photo" accept="image/png, image/jpg, image/jpeg" onChange={this.onPhotoSelect}/>
            </div>
            <div className="field">
              <label htmlFor="name">Nombre</label>
              <input type="text" placeholder="Nombre" value={state.name} />
            </div>
            <div className="field">
              <label htmlFor="email">Correo</label>
              <input type="text" placeholder="Correo" value={state.email} />
            </div>
            <span className="rule">Cambiar contraseña</span>
            <div className="field">
              <label htmlFor="name">Contraseña actual</label>
              <input type="text" placeholder=""/>
            </div>
            <div className="field">
              <label htmlFor="name">Nueva contraseña</label>
              <input type="text" placeholder=""/>
            </div>
            {
              state.changed &&
              <input type="submit" value="Guardar" className="action" />
            }
          </form>
        </div>
      </div>
    )
  }
}

Settings.propTypes = {

}

function mapStateToProps({credentials}) {
  return {
    credentials
  }
}

export default connect(mapStateToProps)(Settings)
