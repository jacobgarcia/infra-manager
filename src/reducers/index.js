import { combineReducers } from 'redux'

// Authentication, initial state from localStorage
function credentials(state = {}, action) {
  switch (action.type) {
    case 'SET_USER':
      return {
        user: {
          _id: action.user._id,
          email: action.user.email,
          name: action.user.name,
          access: action.user.access,
          photoUrl: action.user.photoUrl,
          defaultPosition: action.user.defaultPosition
        },
        token: action.user.token,
        company: action.user.company,
        authenticated: true
      }
    case 'LOG_OUT':
      return {}
    default:
      return state
  }
}

// Global alerts (errors)
function appAlert(state = {}, action) {
  switch (action.type) {
    case 'DISMISS_ALERT':
      return {}
    case 'SET_ALERT':
      return {
        title: action.title,
        body: action.body
      }
    default:
      return state
  }
}

function reports(state = [], action) {
  switch (action.type) {
    case 'SET_INITIAL_REPORTS':
      return [...action.reports]
    case 'SET_REPORT': {
      const foundIndex = state.findIndex(
        ({ site }) => site.key === action.report.site.key
      )
      const newState = [...state] // BUG: It only creates a shallow copy

      foundIndex > -1
        ? (newState[foundIndex] = {
            site: newState[foundIndex].site,
            zone: action.report.zone,
            _id: action.report._id,
            alarms: [...(newState[foundIndex].alarms || [])],
            history: [...(newState[foundIndex].history || [])],
            onlineStatuses: [...(newState[foundIndex].onlineStatuses || [])],
            sensors: [
              {
                timestamp: action.report.timestamp,
                values: [...(action.report.sensors || [])]
              },
              ...(newState[foundIndex].sensors || [])
            ]
          })
        : newState.push({
            site: action.report.site,
            zone: action.report.zone,
            _id: action.report._id,
            alarms: action.report.alarms,
            history: action.report.history,
            onlineStatuses: action.report.onlineStatuses,
            sensors: [
              {
                timestamp: action.report.timestamp,
                values: [...(action.report.sensors || [])]
              }
            ]
          })
      return [...newState]
    }
    case 'SET_ATTENDED': {
      return state.map(
        report =>
          report.site._id === action.alarm.site._id
            ? {
                ...report,
                alarms: report.alarms.map(
                  siteAlarm =>
                    siteAlarm.timestamp === action.alarm.timestamp
                      ? { ...siteAlarm, attended: true }
                      : { ...siteAlarm }
                )
              }
            : report
      )
    }
    default:
      return state
  }
}

function history(state = [], action) {
  switch (action.type) {
    case 'SET_HISTORY': {
      return [action.history, ...state]
    }
    default:
      return state
  }
}

function alarms(state = [], action) {
  switch (action.type) {
    case 'SET_ALARM': {
      return [action.alarm, ...state]
    }
    default:
      return state
  }
}

function zones(state = [], action) {
  switch (action.type) {
    case 'SET_EXHAUSTIVE':
      return [...action.zones]
    case 'SET_ZONE':
      return [
        ...state,
        {
          _id: action.id,
          name: action.name,
          positions: action.positions,
          subzones: [] // IMPORTANT
        }
      ]
    case 'SET_SITE':
      return state.map(
        zone =>
          zone._id === action.zoneId
            ? {
                ...zone,
                sites: [
                  ...zone.sites,
                  {
                    _id: action.siteId,
                    key: action.key,
                    name: action.name,
                    position: action.position
                  }
                ]
              }
            : { ...zone }
      )
    default:
      return state
  }
}

function administrators(state = [], action) {
  switch (action.type) {
    default:
      return state
  }
}

function facialReports(state = [], action) {
  switch (action.type) {
    case 'SET_FACIAL_REPORT':
      return [
        ...state,
        {
          timestamp: action.timestamp,
          event: action.event,
          success: action.success,
          risk: action.risk,
          zone: action.zone,
          status: action.status,
          site: action.site,
          access: action.access,
          pin: action.pin,
          photo: action.photo,
          id: action.id
        }
      ]
    default:
      return state
  }
}

// import facialRecognitionLogs from './facialRecognition'
import cctvLogs from './cctv'
import vehicularFlowLogs from './vehicularFlow'
import accessLogs from './access'
import perimeterLogs from './perimeter'
import inventoryLogs from './inventory'

export default combineReducers({
  credentials,
  zones,
  facialReports,
  accessReports: accessLogs,
  cameraReports: cctvLogs,
  perimeterReports: perimeterLogs,
  vehicularReports: vehicularFlowLogs,
  inventoryReports: inventoryLogs,
  administrators,
  appAlert,
  reports,
  history,
  alarms
})
