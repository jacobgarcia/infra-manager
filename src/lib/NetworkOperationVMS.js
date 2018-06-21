import axios from 'axios'

import constants from './constants'

// TODO check if we're in production, if it's change hostUrl to s3
// const baseUrl = `${constants.hostUrl}/v1`
const vmsUrl = `http://f7b73757.ngrok.io/fusion`
const axiosVMS = axios.create({
  timeout: 1000
})
// const baseUrl = `http://localhost:8080/v1`

// Request interceptors
axiosVMS.interceptors.request.use(
  config => {
    // Add token
    config.headers.Authorization = `Bearer ${localStorage.getItem('vmstoken')}`
    // Do something before request is sent
    return config
  },
  error => Promise.reject(error)
)

class NetworkOperationVMS {
  static login(data) {
    let axiosConfig = {
      headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
    }
    return axiosVMS.post(`${vmsUrl}/users/login`, data, axiosConfig)
  }
  static getJWT() {
    let axiosConfig = {
      headers: {
          'Authorization': `Bearer ${localStorage.getItem('vmstoken')}`
        }
    }
    return axiosVMS.get(`${vmsUrl}/tokens?type=orchid`,axiosConfig)
  }
}

export default NetworkOperationVMS
