import axios from 'axios'

import constants from './constants'

const baseUrl = `${constants.frmUrl}/v1`

// TODO: Eliminate hardcoding token for external server requests
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTMxZDkwNjVkNGU0NDE5OTQzYzYzODYiLCJpYXQiOjE1MTU2MDk5MTB9.g5LI5JDrOjwOGm0bQkPbA3n3oPrC1ihbbTPXODxkvlQ'

// Request interceptors
axios.interceptors.request.use(config => {
  // Add token
  config.headers['x-access-token'] = `${token}`
  // Do something before request is sent
  return config
}, error => Promise.reject(error))

class NetworkOperationFRM {

  static getAvailableSites() {
    return axios.get((`${baseUrl}/cameras/report/clients`))
  }

  static getDebug(camera) {
    return axios.post((`${baseUrl}/cameras/single/debug`),{camera})
  }

  static getAlerts(){
    return axios.get((`${baseUrl}/alerts`))
  }
}

export default NetworkOperationFRM
