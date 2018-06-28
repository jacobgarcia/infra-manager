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
    let frame2 = document.createElement('iframe')
    let frame3 = document.createElement('iframe')
    let frame4 = document.createElement('iframe')

    frame1.setAttribute('onload', this.init(frame1))
    frame1.src = "http://db1bea4d.ngrok.io/?single-player=1"
    frame1.orchidId = "fdfacc2f-4c42-4484-bbb1-9ba7dd4372fc"

    frame2.setAttribute('onload', this.init(frame2))
    frame2.src = "http://db1bea4d.ngrok.io/?single-player=13"
    frame2.orchidId = "fdfacc2f-4c42-4484-bbb1-9ba7dd4372fc"

    frame3.setAttribute('onload', this.init(frame3))
    frame3.src = "http://db1bea4d.ngrok.io/?single-player=15"
    frame3.orchidId = "fdfacc2f-4c42-4484-bbb1-9ba7dd4372fc"

    frame4.setAttribute('onload', this.init(frame4))
    frame4.src = "http://db1bea4d.ngrok.io/?single-player=17"
    frame4.orchidId = "fdfacc2f-4c42-4484-bbb1-9ba7dd4372fc"

    container = document.getElementById('player1')
    container.appendChild(frame1)
    container = document.getElementById('player2')
    container.appendChild(frame2)
    container = document.getElementById('player3')
    container.appendChild(frame3)
    container = document.getElementById('player4')
    container.appendChild(frame4)
  }

  init(frame) {
    this.getFusionToken(token => {
        this.renewJWT(frame, token)
        window.setInterval(() => {
          this.renewJWT(frame, token)
        }, 60000)
      }
    )
  }

  setJWT(frame, jwt) {
    console.log(jwt)
    frame.contentWindow.postMessage({'jwt': jwt}, '*')
    console.log("puse el jwt")
  }

  renewJWT(frame, token) {
    NetworkOperationVMS.getJWT()
      .then(({data}) => {
        console.log("JWT obtained")
        this.setJWT(frame, token)
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
        console.log(data.token)
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
      <div className="vms-content small-padding">
        <Helmet>
          <title>Connus | Video Vigilancia</title>
        </Helmet>
        <div className="content vertical">
        <h2>Video Vigilancia</h2>
          <div className="Grid">
              <div id="player1" className="Grid-item"/>
              <div id="player2" className="Grid-item"/>
              <div id="player3" className="Grid-item"/>
              <div id="player4" className="Grid-item"/>
          </div>
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
