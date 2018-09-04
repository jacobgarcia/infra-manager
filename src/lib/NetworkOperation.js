import axios from 'axios'

import constants from './constants'

const baseUrl = `${constants.hostUrl}/v1`

// Request interceptors
axios.interceptors.request.use(
  config => {
    // Add token
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    config.headers['Cache-Control'] = 'no-cache'
    // Do something before request is sent
    return config
  },
  error => Promise.reject(error)
)

class NetworkOperation {
  static login({ email, password }) {
    return axios.post(`${baseUrl}/authenticate`, { email, password })
  }

  static getSelf() {
    return axios.get(`${baseUrl}/users/self`)
  }

  static getExhaustive() {
    return axios.get(`${baseUrl}/zones/exhaustive`)
  }

  static getAllReports() {
    return axios.get(`${baseUrl}/sites/reports`)
  }

  static getReports(from, to) {
    return axios.get(`${baseUrl}/sites/reports?from=${from}&to=${to}`)
  }

  static getAvailableStates() {
    return axios.get(`${baseUrl}/polygons`)
  }

  static getEntityPolygon(entityId) {
    return axios.get(`${baseUrl}/polygons/${entityId}`)
  }

  static setZone(name, positions) {
    return axios.post(`${baseUrl}/zones`, { name, positions })
  }

  static setSubzone(zone, name, positions) {
    return axios.post(`${baseUrl}/${zone}/subzones`, { positions, name })
  }

  static setSite(zone, subzone, name, key, position) {
    return axios.post(`${baseUrl}/zones/${zone}/subzones/${subzone}/sites`, {
      key,
      position,
      name
    })
  }

  static getGeneralStats(from, to) {
    return axios.get(`${baseUrl}/stats?from=${from}&to=${to}`)
  }

  static uploadProfilePhoto(photoFile) {
    const formData = new FormData()
    formData.append('photo', photoFile)
    return axios.post(`${baseUrl}/users/self/photo`, formData)
  }

  static getGeneralAlarms(from, to) {
    return axios.get(`${baseUrl}/alarms?from=${from}&to=${to}`)
  }

  static getCompanyUsers() {
    return axios.get(`${baseUrl}/users`)
  }

  static getFaceRecognition() {
    return axios.get(`${baseUrl}/facerecognition`)
  }

  static getInventory() {
    return axios.get(`${baseUrl}/sites/sensors`)
  }

  static getSensors(type) {
    return axios.get(`${baseUrl}/sites/sensors/${type}`)
  }

  static getDevices(type) {
    return axios.get(`${baseUrl}/sites/devices/${type}`)
  }

  static getVehicularReports() {
    return axios.get(`${baseUrl}/vehicular-flow/reports`)
  }
  // Video Surveillance
  static createVideoToken(key, id) {
    return axios.post(`${baseUrl}/video/token`, { key, id })
  }

  static getStreams() {
    return axios.get(`${baseUrl}/video/cameras`)
  }

  static getAvailableSites() {
    return axios.get(`${baseUrl}/sites/online`)
  }

  static getSites() {
    return axios.get(`${baseUrl}/sites/list`)
  }

  static getDebug(camera) {
    return axios.post(`${baseUrl}/cameras/single/debug`, { camera })
  }

  static getAlerts() {
    return axios.get(`${baseUrl}/alerts`)
  }

  static getAccess() {
    return axios.get(`${baseUrl}/access/logs`)
  }

  static getCounter() {
    return axios.get(`${baseUrl}/counter/count`)
  }

  static postStream(core, user, pass, streamid, company, site, name, country, zone) {
    return axios.post(`${baseUrl}/stream`, {
      core,
      user,
      pass,
      streamid,
      company,
      site,
      name,
      country,
      zone
    })
  }

  static getStream() {
    return axios.get(`${baseUrl}/stream`)
  }

  static getStreamToken(id) {
    return axios.get(`${baseUrl}/stream/token/${id}`)
  }

  static getAlarmsReports() {
    return axios.get(`${baseUrl}/reports/alarms`)
  }

  static getOtherReport() {
    return axios.get(`${baseUrl}/reports/alarms/other`)
  }

  static getAlarmsSummery(key) {
    return axios.get(`${baseUrl}/reports/alarms/summery/${key}`)
  }
}

export default NetworkOperation
