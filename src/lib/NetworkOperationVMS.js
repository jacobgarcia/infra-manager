import axios from 'axios'

import constants from './constants'

// TODO check if we're in production, if it's change hostUrl to s3
// const baseUrl = `${constants.hostUrl}/v1`

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
  static fusionLogin(data) {
    let axiosConfig = {
      headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
    }
    return axiosVMS.post(`${vmsUrl}/fusion/users/login`, data, axiosConfig)
  }
  static getFusionJWT() {
    let axiosConfig = {
      headers: {
          'Authorization': `Bearer ${localStorage.getItem('vmstoken')}`
        }
    }
    return axiosVMS.get(`${vmsUrl}/fusion/tokens?type=orchid`,axiosConfig)
  }
  static getIssuer(credentials) {
    const axiosConfig = {
      auth: {
        username: credentials.username,
        password: credentials.password
      }
    }
    return axiosVMS.get(`${vmsUrl}/service/trusted/issuer?version=2`,axiosConfig)
  }
  static postIssuer(data, credentials) {
    const axiosConfig = {
      headers: {
          'Content-Type': 'application/json;charset=UTF-8'
      },
      auth: {
          username: credentials.username,
          password: credentials.password
      }
    }
    return axiosVMS.post(`${vmsUrl}/service/trusted/issuer?version=2`,data , axiosConfig)
  }
  static deleteIssuer(data) {
    return axiosVMS.delete(`${vmsUrl}/service/trusted/issuer?version=2`,data)
  }
}

export default NetworkOperationVMS
