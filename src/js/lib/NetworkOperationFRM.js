import axios from 'axios'

import constants from './constants'

const baseUrl = `${constants.frmUrl}/v1`
const baseUrl = `${constants.hostUrl}/v1`

// TODO: Eliminate hardcoding token for external server requests

/*
// Request interceptors
axios.interceptors.request.use(config => {
  // Add token
  config.headers['x-access-token'] = `${token}`
*/
axios.interceptors.request.use(config => {
  // Add token
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
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

  static getAccess(){
    return axios.get((`${baseUrl}/access/logs`))
  }
  static getSensors(){
    return axios.get((`${baseUrl}/sites/getSensors`))
  }

}

export default NetworkOperationFRM
