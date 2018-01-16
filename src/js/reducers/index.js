import { combineReducers } from 'redux'

const dumbAccessesReports = []
const dumbAccessesAlerts = []
const dumbVehicularReports = []
const dumbVehicularAlerts = []
const dumbPermiterReports = []
const dumbPermiterAlerts = []
const dumbFacialReports = [
  {
    day: '9 de Enero',
    hour: '10:14',
    event: 'Registro de personal exitoso',
    zone: 'Centro',
    site: 'MEXTLB1260',
    risk: 0,
    status: 'Registro satisfactorio'
  },
  {
    day: '10 de Enero',
    hour: '10:25',
    event: 'Intento de registro de personal',
    zone: 'Centro',
    site: 'MEXTLB1260',
    risk: 1,
    status: 'Regsitro denegado. Fallo en la detección de rostro'
  },
  {
    day: '10 de Enero',
    hour: '11:34',
    event: 'Registro de personal exitoso',
    zone: 'Centro',
    site: 'MEXATZ0973',
    risk: 0,
    status: 'Registro satisfactorio'
  },
  {
    day: '11 de Enero',
    hour: '14:37',
    event: 'Inicio de sesión exitoso',
    zone: 'Centro',
    site: 'DIFXCH1293',
    risk: 0,
    status: 'Acceso autorizado. Sensorización desactivada'
  },
  {
    day: '11 de Enero',
    hour: '15:00',
    event: 'Registro de salida exitosa',
    zone: 'Centro',
    site: 'DIFXCH1293',
    risk: 0,
    status: 'Acceso autorizado. Sensorización reactivada'
  },
  {
    day: '15 de Enero',
    hour: '08:16',
    event: 'Intento de inicio de sesión',
    zone: 'Centro',
    site: 'MEXJIL1152',
    risk: 2,
    status: 'Acceso autorizado. Sensorización desactivada'
  }
]
const dumbFacialAlerts = []
const dumbCameraReports = []
const dumbCameraAlerts = []

// Loading state
function loading(state = 0, action) {
  switch (action.type) {
    case 'SET_LOADING': return state + 1
    case 'SET_COMPLETE': return state - 1
    default: return state
  }
}

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
          photoUrl: action.user.photoUrl
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
      const foundIndex = state.findIndex(({ site }) => site.key === action.report.site.key)
      const newState = [...state] // BUG: It only creates a shallow copy
      // console.log({report: action.report, foundIndex})

      foundIndex > -1
      ? newState[foundIndex] = {
        site: newState[foundIndex].site,
        zone: action.report.zone,
        subzone: action.report.subzone,
        _id: action.report._id,
        alarms: [{
          timestamp: action.report.timestamp,
          values: [...(action.report.alarms || [])],
          attended: false,
        }, ...(newState[foundIndex].alarms || [])],
        sensors: [{
          timestamp: action.report.timestamp,
          values: [...(action.report.sensors || [])]
        }, ...(newState[foundIndex].sensors || [])]
      }
      : newState.push({
        site: action.report.site,
        zone: action.report.zone,
        subzone: action.report.subzone,
        _id: action.report._id,
        alarms: [{
          timestamp: action.report.timestamp,
          values: [...(action.report.alarms || [])],
          attended: false,
        }],
        sensors: [{
          timestamp: action.report.timestamp,
          values: [...(action.report.sensors || [])]
        }]
      })
      return [...newState]
    }
    case 'SET_ATTENDED': {
      return state.map(report =>
        report.site._id === action.alarm.site._id
        ? {
          ...report,
          alarms: report.alarms.map(siteAlarm =>
            siteAlarm.timestamp === action.alarm.timestamp
            ? {...siteAlarm, attended: true}
            : {...siteAlarm}
          )
        }
        : report
      )
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
      return [...state, {
        _id: action.id,
        name: action.name,
        positions: action.positions,
        subzones: [] // IMPORTANT
      }]
    case 'SET_SUBZONE':
      return state.map(zone =>
        zone._id === action.zoneId
        ? {
          ...zone,
          subzones: [...(zone.subzones || []), {
            _id: action.subzoneId,
            name: action.name,
            positions: action.positions,
            sites: [] // IMPORTANT
          }]
        }
        : {...zone}
      )
    case 'SET_ALL_SITES':
    return state.map(zone =>
      zone._id === action.zoneId
      ? {
        ...zone,
        subzones: zone.subzones.map(subzone =>
          subzone._id === action.subzoneId
          ? {
            ...subzone,
            sites: [...action.sites]
          }
          : {...subzone}
        )
      }
      : {...zone}
    )
    case 'SET_SITE':
      return state.map(zone =>
        zone._id === action.zoneId
        ? {
          ...zone,
          subzones: zone.subzones.map(subzone =>
            subzone._id === action.subzoneId
            ? {
              ...subzone,
              sites: [
                ...(subzone.sites || []),
                {
                  _id: action.siteId,
                  key: action.key,
                  name: action.name,
                  position: action.position
                }
              ]
            }
            : {...subzone}
          )
        }
        : {...zone}
      )
    default:
    return state
  }
}

function facialReports(state = dumbFacialReports, action) {
  switch (action.type) {
    case 'SET_FACIAL_REPORT':
      return [...state, {
        day: action.day,
        hour: action.hour,
        event: action.positions,
        site: action.site,
        risk: action.risk,
        status: action.status,
      }]
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

const appReducer = combineReducers({
  loading,
  credentials,
  zones,
  facialReports,
  administrators,
  appAlert,
  reports
})

export default appReducer
