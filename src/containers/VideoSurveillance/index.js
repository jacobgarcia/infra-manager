import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

class VideoSurveillance extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    let frame1 = document.createElement('iframe')
    frame1.src = "http://192.168.100.119:8080/?single-player=27"
    frame1.orchidId = "0ab98ec0-753a-4596-b8d1-74d68787b2f7"
    frame1.setAttribute('onload', this.init(frame1))
    console.log("src defining")
    let container = document.getElementById('players')
    container.appendChild(frame1)
  }

  init(frame) {
    this.getFusionToken(token => {
        frame.authToken = token
        this.renewJWT(frame)
        window.setInterval(() => {
          this.renewJWT(frame)
        }, 60000)
      }
    )
  }

  setJWT(frame, jwt) {
    console.log(jwt)
    frame.contentWindow.postMessage({'jwt': jwt}, '*')
  }

  renewJWT(frame) {
    let xhttp = new XMLHttpRequest()
    xhttp.open("GET", "http://192.168.100.119:8080/fusion/tokens?type=orchid", true)
    xhttp.setRequestHeader("Authorization", "Bearer " + frame.authToken)
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
      // Success-- retrieve our JWT from the response
      console.log("JWT obtained")
      let jwt = JSON.parse(xhttp.responseText)[frame.orchidId]
      this.setJWT(frame, jwt)
      }
    }
    xhttp.send()
  }
  getFusionToken(callback) {
    let data = JSON.stringify({
      "username": "admin",
      "password": "admin"
    })
    let xhttp = new XMLHttpRequest()
    xhttp.withCredentials = true
    xhttp.open("POST", "http://192.168.100.119:8080/fusion/users/login")
    xhttp.setRequestHeader("content-type", "application/json")
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        console.log("Token obtaind")
        callback(JSON.parse(xhttp.responseText).token)
      }
    }
    xhttp.send(data)
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
