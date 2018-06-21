import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { NetworkOperationVMS } from 'lib'

let container = null

class VideoSurveillance extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    let frame1 = document.createElement('iframe')
    frame1.setAttribute('onload', this.init(frame1))
    frame1.src = "http://25463c71.ngrok.io/?single-player=1"
    frame1.orchidId = "fdfacc2f-4c42-4484-bbb1-9ba7dd4372fc"
    console.log("src defining")
    container = document.getElementById('players')
    console.log("apending C")
  }

  init(frame) {
    this.getFusionToken(token => {
        container.appendChild(frame)
        this.renewJWT(frame)
        window.setInterval(() => {
          this.renewJWT(frame)
        }, 30000)
      }
    )
  }

  setJWT(frame, jwt) {
    console.log(jwt)
    frame.contentWindow.postMessage({'jwt': jwt}, '*')
    console.log("puse el jwt")
  }

  renewJWT(frame) {
    NetworkOperationVMS.getJWT()
      .then(({data}) => {
        console.log("JWT obtained")
        this.setJWT(frame, data[frame.orchidId])
      })
      .catch(({response = {} }) => {
        const { status = 500 } = response
        console.log(status)
      })
  }

  getFusionToken(callback) {
    let data = JSON.stringify({
      "username": "admin",
      "password": "admin"
    })
    NetworkOperationVMS.login(data)
      .then(({data}) => {
        localStorage.setItem('vmstoken', data.token)
        console.log("Token obtaind")
        callback(data.token)
      })
      .catch(({response = {} }) => {
        const { status = 500 } = response
        console.log(status)
      })
  }

  render() {
    const {state} = this
    return (
      <div className="app-content small-padding">
        <Helmet>
          <title>Connus | Video Vigilancia</title>
        </Helmet>
        <div className="content vertical">
          <h2>Video Vigilancia</h2>
          <div id="players" />
        </div>
      </div>
    )
  }
}

VideoSurveillance.propTypes = {
  cameraReports: PropTypes.array
}

function mapStateToProps({ cameraReports }) {
  return {
    cameraReports
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoSurveillance)
